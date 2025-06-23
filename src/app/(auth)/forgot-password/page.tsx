"use client";

import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ email: string }>({
    defaultValues: {
      email: emailParam || "",
    },
  });

  const { mutate: requestReset } = api.auth.requestPasswordReset.useMutation({
    onSuccess: () => {
      toast({
        title: "Email enviado",
        description: "Se o email existir em nosso sistema, você receberá um link para redefinir sua senha.",
      });
      router.push("/sign-in");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col items-center justify-center bg-[#e6f0fb] p-4 relative">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">Redefinir senha</CardTitle>
          <CardDescription className="text-center">
            Digite seu e-mail e enviaremos um link para redefinir sua senha
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit((data) => requestReset(data))} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email", { required: true })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar link de redefinição"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-4">
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
