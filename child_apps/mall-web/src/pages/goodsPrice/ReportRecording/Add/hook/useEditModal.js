import { useState, useEffect } from 'react'

const useEditModal = () => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [lookingRecord, setLookingRecord] = useState(null)
  const [haveChange, setHaveChange] = useState(false)

  const openEditModal = (record) => {
    setLookingRecord(record)
    setShowEditModal(true)
    setHaveChange(false)
  }
  const closeEditModal = () => {
    setLookingRecord(null)
    setShowEditModal(false)
    setHaveChange(false)
  }

  return {
    showEditModal,
    openEditModal,
    closeEditModal,
    lookingRecord,
    haveChange,
    setHaveChange,
  }
}

export default useEditModal
