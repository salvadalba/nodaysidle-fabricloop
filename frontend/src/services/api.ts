const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

interface LoginData {
    email: string
    password: string
}

interface RegisterData {
    email: string
    password: string
    companyName: string
    role: string
    phone: string
}

interface AuthResponse {
    user: {
        userId: string
        email: string
        companyName: string
        role: string
        createdAt?: string
    }
    tokens?: {
        accessToken: string
        refreshToken: string
    }
}

class ApiService {
    private accessToken: string | null = null

    constructor() {
        this.accessToken = localStorage.getItem('accessToken')
    }

    setToken(token: string) {
        this.accessToken = token
        localStorage.setItem('accessToken', token)
    }

    clearToken() {
        this.accessToken = null
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        }

        if (this.accessToken) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error?.message || 'An error occurred')
        }

        return data
    }

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        })

        if (response.tokens) {
            this.setToken(response.tokens.accessToken)
            localStorage.setItem('refreshToken', response.tokens.refreshToken)
        }

        return response
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        })

        return response
    }

    async getMe(): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/me')
    }

    isAuthenticated(): boolean {
        return !!this.accessToken
    }
}

export const api = new ApiService()
export default api
