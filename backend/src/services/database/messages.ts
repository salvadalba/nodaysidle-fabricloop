import { query } from '../../config/database.js'

export interface Message {
    id: string
    senderId: string
    recipientId: string
    materialId: string | null
    content: string
    isRead: boolean
    createdAt: Date
    sender?: {
        companyName: string
        email: string
    }
    recipient?: {
        companyName: string
        email: string
    }
    material?: {
        title: string
    }
}

export interface Conversation {
    partnerId: string
    partnerName: string
    lastMessage: string
    lastMessageAt: Date
    unreadCount: number
}

// Get conversations for a user
export async function getConversations(userId: string): Promise<Conversation[]> {
    const result = await query(
        `WITH conversations AS (
      SELECT 
        CASE WHEN sender_id = $1 THEN recipient_id ELSE sender_id END as partner_id,
        content,
        created_at,
        is_read,
        sender_id
      FROM messages
      WHERE sender_id = $1 OR recipient_id = $1
    ),
    latest AS (
      SELECT DISTINCT ON (partner_id)
        partner_id,
        content as last_message,
        created_at as last_message_at
      FROM conversations
      ORDER BY partner_id, created_at DESC
    ),
    unread_counts AS (
      SELECT 
        sender_id as partner_id,
        COUNT(*) as unread
      FROM messages
      WHERE recipient_id = $1 AND is_read = false
      GROUP BY sender_id
    )
    SELECT 
      l.partner_id,
      u.company_name as partner_name,
      l.last_message,
      l.last_message_at,
      COALESCE(uc.unread, 0) as unread_count
    FROM latest l
    JOIN users u ON l.partner_id = u.id
    LEFT JOIN unread_counts uc ON l.partner_id = uc.partner_id
    ORDER BY l.last_message_at DESC`,
        [userId]
    )

    return result.rows.map((row) => ({
        partnerId: row.partner_id,
        partnerName: row.partner_name,
        lastMessage: row.last_message,
        lastMessageAt: new Date(row.last_message_at),
        unreadCount: parseInt(row.unread_count, 10),
    }))
}

// Get messages between two users
export async function getMessagesBetweenUsers(
    userId: string,
    partnerId: string,
    limit = 50
): Promise<Message[]> {
    const result = await query(
        `SELECT 
      m.*,
      s.company_name as sender_company_name,
      s.email as sender_email,
      r.company_name as recipient_company_name,
      r.email as recipient_email,
      mat.title as material_title
    FROM messages m
    JOIN users s ON m.sender_id = s.id
    JOIN users r ON m.recipient_id = r.id
    LEFT JOIN materials mat ON m.material_id = mat.id
    WHERE (m.sender_id = $1 AND m.recipient_id = $2)
       OR (m.sender_id = $2 AND m.recipient_id = $1)
    ORDER BY m.created_at DESC
    LIMIT $3`,
        [userId, partnerId, limit]
    )

    // Mark messages as read
    await query(
        `UPDATE messages SET is_read = true 
    WHERE recipient_id = $1 AND sender_id = $2 AND is_read = false`,
        [userId, partnerId]
    )

    return result.rows.map(mapRowToMessage).reverse()
}

// Send a message
export async function sendMessage(
    senderId: string,
    recipientId: string,
    content: string,
    materialId?: string
): Promise<Message> {
    const result = await query(
        `INSERT INTO messages (sender_id, recipient_id, content, material_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
        [senderId, recipientId, content, materialId || null]
    )

    return mapRowToMessage(result.rows[0])
}

// Get unread count
export async function getUnreadCount(userId: string): Promise<number> {
    const result = await query(
        `SELECT COUNT(*) FROM messages WHERE recipient_id = $1 AND is_read = false`,
        [userId]
    )
    return parseInt(result.rows[0].count, 10)
}

function mapRowToMessage(row: Record<string, unknown>): Message {
    const message: Message = {
        id: row.id as string,
        senderId: row.sender_id as string,
        recipientId: row.recipient_id as string,
        materialId: row.material_id as string | null,
        content: row.content as string,
        isRead: row.is_read as boolean,
        createdAt: new Date(row.created_at as string),
    }

    if (row.sender_company_name) {
        message.sender = {
            companyName: row.sender_company_name as string,
            email: row.sender_email as string,
        }
    }

    if (row.recipient_company_name) {
        message.recipient = {
            companyName: row.recipient_company_name as string,
            email: row.recipient_email as string,
        }
    }

    if (row.material_title) {
        message.material = {
            title: row.material_title as string,
        }
    }

    return message
}
