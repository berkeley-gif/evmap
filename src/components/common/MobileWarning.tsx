import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'semantic-ui-react'

const MobileWarningModal = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const checkViewport = () => {
      const mobileView = window.innerWidth < 768
      setIsMobile(mobileView)
      setOpen(mobileView)
    }
    checkViewport()
  }, [])

  if (!isMobile) {
    return null
  }

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      size="small"
      closeIcon
      style={{ width: '90%', maxWidth: '400px', margin: '0 auto' }}
    >
      <Modal.Header>App Not Optimized for Mobile</Modal.Header>
      <Modal.Content>
        <p>
          This app is not optimized for mobile devices. For the best experience, please view it on a desktop
          or a larger screen.
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)} primary>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default MobileWarningModal
