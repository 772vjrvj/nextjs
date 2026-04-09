import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 조회
export async function GET() {
    const users = await prisma.user.findMany()
    return Response.json(users)
}

// 추가 (INSERT)
export async function POST() {
    const user = await prisma.user.create({
        data: {
            name: "민수",
            email: "test@test.com"
        }
    })
    return Response.json(user)
}