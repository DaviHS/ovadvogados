"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<{
    newPassword: string;
    confirmPassword: string;
  }>();

  const { mutate: resetPassword } = api.auth.resetPassword.useMutation({
    onSuccess: () => {
      toast({
        title: "Senha alterada",
        description: "Sua senha foi redefinida com sucesso.",
      });
      router.push("/sign-in");
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col items-center justify-center bg-[#e6f0fb] p-4 relative space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-destructive">Token inválido</CardTitle>
            <CardDescription>
              O link de redefinição está incompleto ou expirou.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/forgot-password")}>
              Solicitar novo link
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col items-center justify-center bg-[#e6f0fb] p-4 relative">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-primary font-bold">
            Redefinir Senha
          </CardTitle>
          <CardDescription className="text-center">
            Digite sua nova senha
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit((data) => resetPassword({ ...data, token }))}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                {...register("newPassword", { required: true, minLength: 8 })}
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: true,
                  validate: (value) =>
                    value === watch("newPassword") || "As senhas não coincidem",
                })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-muted-foreground"
            onClick={() => router.push("/sign-in")}
          >
            ← Voltar para o login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
