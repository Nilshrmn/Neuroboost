"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Brain, LogIn, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AuthScreen({ onBack, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!nickname || !password) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive",
      })
      return
    }

    if (isLogin) {
      // Login logic
      const storedUser = localStorage.getItem("neuroboost_user")
      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user.nickname === nickname && user.password === password) {
          toast({
            title: "Erfolgreich angemeldet!",
            description: `Willkommen zurück, ${nickname}!`,
          })
          onSuccess()
        } else {
          toast({
            title: "Fehler",
            description: "Ungültige Anmeldedaten.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Fehler",
          description: "Kein Konto gefunden. Bitte registrieren Sie sich.",
          variant: "destructive",
        })
      }
    } else {
      // Registration logic
      const user = {
        nickname,
        email: email || null,
        password,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem("neuroboost_user", JSON.stringify(user))

      toast({
        title: "Konto erfolgreich erstellt!",
        description: `Willkommen bei NeuroBoost, ${nickname}!`,
      })

      onSuccess()
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col justify-center">
      <Button variant="ghost" onClick={onBack} className="mb-8 self-start">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Zurück
      </Button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <Brain className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">{isLogin ? "Anmelden" : "Registrieren"}</h1>
        <p className="text-muted-foreground">
          {isLogin
            ? "Melden Sie sich an, um Ihren Fortschritt zu speichern"
            : "Erstellen Sie ein Konto und starten Sie Ihr Training"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isLogin ? "Bei Ihrem Konto anmelden" : "Neues Konto erstellen"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Geben Sie Ihre Anmeldedaten ein"
              : "E-Mail ist optional und wird für Passwort-Zurücksetzen verwendet"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname *</Label>
              <Input
                id="nickname"
                type="text"
                placeholder="Ihr Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ihre@email.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Passwort *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ihr Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              {isLogin ? (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Anmelden
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrieren
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin)
                setNickname("")
                setEmail("")
                setPassword("")
              }}
            >
              {isLogin ? "Noch kein Konto? Jetzt registrieren" : "Bereits ein Konto? Anmelden"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
