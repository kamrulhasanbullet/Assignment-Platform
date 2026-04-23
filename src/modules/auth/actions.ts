"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { hash } from "bcryptjs";
import { z } from "zod";
import { getUserByEmail } from "@/src/lib/db";
import { createUser } from "@/src/lib/db";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[^a-zA-Z\d]/, "Password must contain a special character"),
  role: z.enum(["STUDENT", "INSTRUCTOR"]),
});

export async function registerUser(formData: FormData) {
  try {
    const validatedFields = registerSchema.parse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    });

    const { firstName, lastName, email, password, role } = validatedFields;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    await createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    });

    redirect("/instructor/dashboard");
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
}
