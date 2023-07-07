import React from 'react'

export const CommonContext = React.createContext()

// eslint-disable-next-line react/prop-types
export const CommonProvider = ({ children }) => {
  const [signedEmail, setSignedEmail] = React.useState(null)

  const isComponentMounted = React.useRef(true)

  React.useEffect(() => {
    return () => {
      isComponentMounted.current = false
    }
  }, [])

  const mounted = isComponentMounted

  const removeSignedEmail = () => setSignedEmail(null)

  const addSignedEmail = (email) => setSignedEmail({ email })

  const value = {
    mounted,
    signedEmail,
    addSignedEmail: React.useCallback((email) => addSignedEmail(email), []),
    removeSignedEmail: React.useCallback(() => removeSignedEmail(), []),
  }

  return <CommonContext.Provider value={value}>{children}</CommonContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCommon = () => {
  const { mounted, signedEmail, addSignedEmail, removeSignedEmail } =
    React.useContext(CommonContext)
  return {
    mounted,
    signedEmail,
    addSignedEmail,
    removeSignedEmail,
  }
}
