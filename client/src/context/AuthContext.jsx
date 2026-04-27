import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] =useState(() =>{
        const savedUser = localStorage.getItem('user')
        return savedUser ? JSON.parse(savedUser): null
    })

    const login = (userData) =>{
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
    }
    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
    }

    // Provide user, login, logout to every component inside the app
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {/* children means whatever is wrapped inside AuthProvider */}
      {children}
    </AuthContext.Provider>
  )
}