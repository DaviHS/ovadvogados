import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Props {
  email: string
  password: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
}

export default function Fields({
  email,
  password,
  onEmailChange,
  onPasswordChange,
}: Props) {
  const router = useRouter()

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`)
  }

  return (
    <>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          E-mail
        </label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            Senha
          </label>
          <Link 
            href="/forgot-password" 
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:underline"
          >
            Esqueceu a senha?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
        />
      </div>
    </>
  )
}