import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/supabase-server'
import { ensureUserExists } from '@/lib/db-helpers'
import { z } from 'zod'

const createCategoryRequestSchema = z.object({
    name: z.string().min(1, 'Name is required').max(30),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    icon: z.string().optional(),
    description: z.string().max(100).optional(),
})

export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Ensure user exists in our users table
        await ensureUserExists(user.id, user.email || '')

        const body = await request.json()
        const validatedData = createCategoryRequestSchema.parse(body)

        const categoryData = {
            ...validatedData,
            user_id: user.id,
        }

        const { data, error } = await supabase
            .from('categories')
            .insert(categoryData)
            .select()
            .single()

        if (error) {
            console.error('Error creating category:', error)
            return NextResponse.json(
                { error: 'Failed to create category' },
                { status: 500 }
            )
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        console.error('Error creating category:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation failed', details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Ensure user exists in our users table
        await ensureUserExists(user.id, user.email || '')

        const { data, error } = await supabase
            .from('categories')
            .select('id, name, color, icon')
            .eq('user_id', user.id)
            .order('name')

        if (error) {
            console.error('Error fetching categories:', error)
            return NextResponse.json(
                { error: 'Failed to fetch categories' },
                { status: 500 }
            )
        }

        return NextResponse.json(data || [])
    } catch (error) {
        console.error('Error in categories API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 