import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import './ClassroomChat.css'

export default function ClassroomChat({ classroomId, mode, students, teacherName, teacherId, assignments, collapsed, onToggle }) {
  const { user, authFetch } = useAuth()
  const [activeContactId, setActiveContactId] = useState(
    mode === 'student' && teacherId ? teacherId : null
  )
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  const contactList = mode === 'teacher'
    ? (students || [])
    : (teacherId ? [{ id: teacherId, name: teacherName }] : [])

  const fetchMessages = useCallback((contactId) => {
    if (!contactId) return
    const url = mode === 'teacher'
      ? `/classrooms/${classroomId}/messages?recipient=${contactId}`
      : `/classrooms/${classroomId}/messages`
    authFetch(url)
      .then(data => setMessages(data))
      .catch(() => setMessages([]))
  }, [classroomId, mode, authFetch])

  useEffect(() => {
    if (activeContactId) {
      fetchMessages(activeContactId)
    }
  }, [activeContactId, fetchMessages])

  useEffect(() => {
    if (!activeContactId) return
    const interval = setInterval(() => fetchMessages(activeContactId), 5000)
    return () => clearInterval(interval)
  }, [activeContactId, fetchMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!messages.length || !user) return
    const unread = messages.filter(m => m.recipient_id === user.id && !m.read_at)
    if (unread.length === 0) return
    const latest = unread[unread.length - 1]
    authFetch(`/messages/${latest.id}/read`, { method: 'PUT' }).catch(() => {})
  }, [messages, user, authFetch])

  async function handleSend(e) {
    e.preventDefault()
    if (!newMessage.trim() || sending || !activeContactId) return

    setSending(true)
    try {
      const body = {
        recipient_id: activeContactId,
        content: newMessage.trim(),
      }
      if (selectedAssignmentId) {
        body.assignment_id = parseInt(selectedAssignmentId)
      }

      const msg = await authFetch(`/classrooms/${classroomId}/messages`, {
        method: 'POST',
        body,
      })

      setMessages(prev => [...prev, msg])
      setNewMessage('')
      setSelectedAssignmentId('')
    } catch (err) {
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  function handleContactClick(studentId) {
    setActiveContactId(studentId)
  }

  const hasUnread = (contactId) => {
    if (!user) return false
    return messages.some(m => m.sender_id === contactId && m.recipient_id === user.id && !m.read_at)
  }

  const totalUnread = mode === 'teacher'
    ? contactList.reduce((sum, s) => sum + (hasUnread(s.id) ? 1 : 0), 0)
    : 0

  if (collapsed) {
    return (
      <div className="classroom-chat classroom-chat--collapsed">
        <button className="classroom-chat__toggle" onClick={onToggle} title="Open chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {totalUnread > 0 && <span className="classroom-chat__toggle-badge">{totalUnread}</span>}
        </button>
      </div>
    )
  }

  return (
    <div className={`classroom-chat classroom-chat--expanded classroom-chat--${mode}`}>
      <button className="classroom-chat__close" onClick={onToggle} title="Close chat">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      {mode === 'teacher' && (
        <div className="classroom-chat__contacts">
          <h4 className="classroom-chat__contacts-title">Messages</h4>
          {contactList.length === 0 ? (
            <p className="classroom-chat__empty">No students yet.</p>
          ) : (
            <div className="classroom-chat__contact-list">
              {contactList.map(s => (
                <button
                  key={s.id}
                  className={`classroom-chat__contact ${activeContactId === s.id ? 'classroom-chat__contact--active' : ''}`}
                  onClick={() => handleContactClick(s.id)}
                >
                  <span className="classroom-chat__contact-name">{s.name}</span>
                  {hasUnread(s.id) && <span className="classroom-chat__contact-badge" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="classroom-chat__main">
        {!activeContactId && mode === 'teacher' ? (
          <div className="classroom-chat__placeholder">
            <p>Select a student to start messaging</p>
          </div>
        ) : mode === 'student' && !activeContactId ? (
          <div className="classroom-chat__placeholder">
            <p>Loading conversation…</p>
          </div>
        ) : (
          <>
            <div className="classroom-chat__messages">
              {messages.length === 0 ? (
                <p className="classroom-chat__empty-msg">No messages yet. Send one below!</p>
              ) : (
                messages.map(m => (
                  <div
                    key={m.id}
                    className={`classroom-chat__bubble ${m.sender_id === user?.id ? 'classroom-chat__bubble--self' : ''}`}
                  >
                    <div className="classroom-chat__bubble-header">
                      <span className="classroom-chat__bubble-sender">{m.sender_name}</span>
                      <span className="classroom-chat__bubble-time">
                        {new Date(m.created_at + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="classroom-chat__bubble-text">{m.content}</p>
                    {m.assignment_id && (
                      <span className="classroom-chat__bubble-assignment">
                        Assignment: {m.assignment_title || `#${m.assignment_id}`}
                      </span>
                    )}
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            <form className="classroom-chat__input-row" onSubmit={handleSend}>
              <div className="classroom-chat__input-wrap">
                <input
                  className="classroom-chat__input"
                  type="text"
                  placeholder="Type a message…"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  autoComplete="off"
                />
                {assignments && assignments.length > 0 && (
                  <select
                    className="classroom-chat__assignment-select"
                    value={selectedAssignmentId}
                    onChange={e => setSelectedAssignmentId(e.target.value)}
                  >
                    <option value="">Mention assignment</option>
                    {assignments.map(a => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </select>
                )}
              </div>
              <button className="classroom-chat__send" type="submit" disabled={sending || !newMessage.trim()}>
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
