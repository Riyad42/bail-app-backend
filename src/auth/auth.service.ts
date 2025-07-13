import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';




const prisma = new PrismaClient();



@Injectable()


export class AuthService {

    constructor(private config: ConfigService) { }

    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new UnauthorizedException('Email ou mot de passe incorrect.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Email ou mot de passe incorrect.');
        }

        const token = this.generateToken(user);

        return { token };
    }


    async register(name: string, email: string, password: string) {

        const passwordIsStrong = /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
        if (!passwordIsStrong) {
            throw new BadRequestException(
                'Mot de passe trop faible. Il doit contenir au moins 8 caractères, 1 majuscule et 1 chiffre.'
            );
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });

            const token = this.generateToken(user);
            return { token };
        } catch (error) {
            if (error.code === 'P2002') {

                throw new BadRequestException('Cet email est déjà utilisé.');
            }
            throw new BadRequestException("Erreur lors de l'inscription.");
        }
    }



    private generateToken(user: { id: number; email: string; name: string, role: string }) {
        const secret = this.config.get<string>('JWT_SECRET');
        console.log('JWT_SECRET =', secret);

        if (!secret) {
            throw new Error('Clé JWT manquante');
        }

        return jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            secret,
            { expiresIn: '7d' }
        );

    }


    async updateProfile(userId: number, data: { name?: string; email?: string }) {
        const updateData: any = {};

        if (data.name?.trim()) updateData.name = data.name;
        if (data.email?.trim()) updateData.email = data.email;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        const newToken = this.generateToken({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });

        return {
            user: updatedUser,
            token: newToken,
        };


    }

    async updatePassword(userId: number, oldPassword: string, newPassword: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new BadRequestException('Utilisateur introuvable.');

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) throw new BadRequestException('Mot de passe actuel incorrect.');

        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashed },
        });

        return { message: 'Mot de passe mis à jour avec succès.' };
    }
}

