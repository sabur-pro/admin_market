import { getAuthToken } from './client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://135.125.182.46:3000'

export const uploadApi = {
  uploadProductImage: async (file: File): Promise<{ imageUrl: string; filename: string }> => {
    const formData = new FormData()
    formData.append('file', file)

    const token = getAuthToken()
    
    const response = await fetch(`${API_BASE_URL}/upload/product-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }))
      throw new Error(error.message || 'Failed to upload image')
    }

    return response.json()
  },
}

