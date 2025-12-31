import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderDetails {
    orderId: string
    materialTitle: string
    quantity: number
    unit: string
    totalAmount: number
    currency: string
    buyerEmail: string
    buyerCompany: string
    sellerEmail?: string
    sellerCompany?: string
}

export class EmailService {
    private static fromEmail = 'FabricLoop <onboarding@resend.dev>'

    static async sendOrderConfirmationToBuyer(order: OrderDetails) {
        if (!process.env.RESEND_API_KEY) {
            console.log('RESEND_API_KEY not set, skipping email')
            return
        }

        try {
            await resend.emails.send({
                from: this.fromEmail,
                to: order.buyerEmail,
                subject: `Order Confirmed - FabricLoop #${order.orderId.slice(0, 8)}`,
                html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #0A0F0A; color: #F0F5F0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #111711; border-radius: 16px; padding: 32px; }
        .header { text-align: center; margin-bottom: 24px; }
        .logo { color: #A7D930; font-size: 24px; font-weight: bold; }
        h1 { color: #A7D930; font-size: 20px; margin: 0 0 8px 0; }
        .order-box { background: #1A221A; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .order-id { color: #8B9A8B; font-size: 14px; }
        .detail { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2A322A; }
        .detail:last-child { border-bottom: none; }
        .label { color: #8B9A8B; }
        .value { color: #F0F5F0; font-weight: 500; }
        .total { font-size: 24px; color: #A7D930; font-weight: bold; text-align: right; margin-top: 16px; }
        .footer { text-align: center; margin-top: 24px; color: #8B9A8B; font-size: 12px; }
        .btn { display: inline-block; background: #A7D930; color: #0A0F0A; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🌿 FabricLoop</div>
        </div>
        
        <h1>Order Confirmed!</h1>
        <p>Thank you for your order, ${order.buyerCompany}!</p>
        
        <div class="order-box">
            <div class="order-id">Order #${order.orderId.slice(0, 8)}</div>
            
            <div class="detail">
                <span class="label">Material</span>
                <span class="value">${order.materialTitle}</span>
            </div>
            <div class="detail">
                <span class="label">Quantity</span>
                <span class="value">${order.quantity} ${order.unit}</span>
            </div>
            <div class="detail">
                <span class="label">Status</span>
                <span class="value" style="color: #0D9488;">Pending</span>
            </div>
            
            <div class="total">${order.currency} ${Number(order.totalAmount).toFixed(2)}</div>
        </div>
        
        <p style="text-align: center;">
            <a href="https://fabricloop.vercel.app/orders" class="btn">View Your Orders</a>
        </p>
        
        <div class="footer">
            <p>🌱 Together we're building a sustainable textile industry.</p>
            <p>FabricLoop - Circular Economy Marketplace</p>
        </div>
    </div>
</body>
</html>
                `
            })
            console.log(`Order confirmation email sent to buyer: ${order.buyerEmail}`)
        } catch (error) {
            console.error('Failed to send buyer email:', error)
        }
    }

    static async sendOrderNotificationToSeller(order: OrderDetails) {
        if (!process.env.RESEND_API_KEY || !order.sellerEmail) {
            console.log('RESEND_API_KEY or seller email not set, skipping email')
            return
        }

        try {
            await resend.emails.send({
                from: this.fromEmail,
                to: order.sellerEmail,
                subject: `New Order Received - FabricLoop #${order.orderId.slice(0, 8)}`,
                html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #0A0F0A; color: #F0F5F0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #111711; border-radius: 16px; padding: 32px; }
        .header { text-align: center; margin-bottom: 24px; }
        .logo { color: #A7D930; font-size: 24px; font-weight: bold; }
        h1 { color: #A7D930; font-size: 20px; margin: 0 0 8px 0; }
        .order-box { background: #1A221A; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .order-id { color: #8B9A8B; font-size: 14px; }
        .detail { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2A322A; }
        .detail:last-child { border-bottom: none; }
        .label { color: #8B9A8B; }
        .value { color: #F0F5F0; font-weight: 500; }
        .total { font-size: 24px; color: #A7D930; font-weight: bold; text-align: right; margin-top: 16px; }
        .footer { text-align: center; margin-top: 24px; color: #8B9A8B; font-size: 12px; }
        .btn { display: inline-block; background: #A7D930; color: #0A0F0A; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🌿 FabricLoop</div>
        </div>
        
        <h1>New Order Received!</h1>
        <p>Great news, ${order.sellerCompany}! You have a new order.</p>
        
        <div class="order-box">
            <div class="order-id">Order #${order.orderId.slice(0, 8)}</div>
            
            <div class="detail">
                <span class="label">Buyer</span>
                <span class="value">${order.buyerCompany}</span>
            </div>
            <div class="detail">
                <span class="label">Material</span>
                <span class="value">${order.materialTitle}</span>
            </div>
            <div class="detail">
                <span class="label">Quantity</span>
                <span class="value">${order.quantity} ${order.unit}</span>
            </div>
            
            <div class="total">${order.currency} ${Number(order.totalAmount).toFixed(2)}</div>
        </div>
        
        <p style="text-align: center;">
            <a href="https://fabricloop.vercel.app/orders" class="btn">Manage Orders</a>
        </p>
        
        <div class="footer">
            <p>🌱 Together we're building a sustainable textile industry.</p>
            <p>FabricLoop - Circular Economy Marketplace</p>
        </div>
    </div>
</body>
</html>
                `
            })
            console.log(`Order notification email sent to seller: ${order.sellerEmail}`)
        } catch (error) {
            console.error('Failed to send seller email:', error)
        }
    }
}
