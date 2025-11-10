import React, { useCallback, useEffect, useState } from 'react'
import { Button, Modal } from 'semantic-ui-react'

const MobileWarningModal = () => {
  /**
   * MobileWarningModal
   *
   * Displays a one-time modal warning on small/mobile viewports informing users that
   * the application is not optimized for mobile. Detects viewport size, debounces
   * resize events, and persists the user's dismissal in sessionStorage for the
   * current session. The component renders nothing on non-mobile viewports.
   */
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)

  const handleClose = useCallback(() => {
    try {
      sessionStorage.setItem('seenMobileWarning', 'true')
    } catch {
      console.warn('Could not access sessionStorage to set seenMobileWarning')
    }
    setOpen(false)
  }, [])

  useEffect(() => {
    let timeout: number | null = null

    const checkViewport = () => {
      const mobileView = window.innerWidth < 768
      setIsMobile(mobileView)
      try {
        const hasSeen = sessionStorage.getItem('seenMobileWarning')
        if (mobileView && !hasSeen) {
          setOpen(true)
        }
      } catch {
        if (mobileView) setOpen(true)
      }
    }
    checkViewport()
    const onResize = () => {
      if (timeout) window.clearTimeout(timeout)
      timeout = window.setTimeout(checkViewport, 350)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (timeout) window.clearTimeout(timeout)
    }
  }, [])

  if (!isMobile) return null

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="small"
      closeIcon
      className="mobile-warning-modal"
      aria-label="Mobile warning dialog"
    >
      <Modal.Header>App Not Optimized for Mobile</Modal.Header>
      <Modal.Content>
        <p>
          This app is not optimized for mobile devices. For the best experience, please view it on a desktop
          or a larger screen.
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)} primary aria-label="Close mobile warning">
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default MobileWarningModal
