import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useMessageDispatch, useMessageState } from '../../context/message'
import { gql, useLazyQuery } from '@apollo/client';
import moment from 'moment'
import classNames from 'classnames'
import MessageForm from '../MessageForm/MessageForm';
import { Fragment } from 'react';

const GET_MESSAGES = gql`
  query getMessages($rid: String!) {
    getMessages(rid: $rid) {
      mid
      from
      to
      content
      created
    }
  }
`

const Messages = ({ currentUser, messagesContRef }) => {
  const { rooms } = useMessageState()
  const dispatch = useMessageDispatch()

  const selectedRoom = rooms?.find((room) => room.selected === true)

  const messages = selectedRoom?.messages

  const [
    getMessages,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES)

  useEffect(() => {
    if (selectedRoom && !selectedRoom.messages) {
      getMessages({ variables: { rid: selectedRoom.rid } })
    }
  }, [selectedRoom])

  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: 'SET_ROOM_MESSAGES',
        payload: {
          rid: selectedRoom.rid,
          messages: messagesData.getMessages,
        },
      })
    }
  }, [messagesData])

  if (!messages || messagesLoading) return (
    <div className="messages-container px-4 py-5 chat-box bg-white" ref={messagesContRef}></div>
  )

  return (
    <Fragment>
      <div className="messages-container px-4 py-5 chat-box bg-white" ref={messagesContRef} >
        {
          messages.map(message => {
            const sent = message.from === currentUser.uid;
            const received = !sent
            const userImage = selectedRoom.from.uid == message.from ? selectedRoom.from.picture : selectedRoom.to.picture;

            return (
              <div
                key={message.mid}
                className={classNames('media w-50 mb-3', {
                  'ml-auto': sent,
                  'mr-auto': received,
                })}
              >
                {
                  received && <img src={userImage} alt="user" width="40" height="40" className="rounded-circle" />
                }
                <div className="media-body ml-3">
                  <div
                    className={classNames('rounded py-2 px-3 mb-2', {
                      'bg-primary': sent,
                      'bg-light': received,
                    })}
                  >
                    <p
                      className={classNames('text-small mb-0', {
                        'text-white': sent,
                        'text-muted': received,
                      })}
                    >{message.content}</p>
                  </div>
                  <p className="small text-muted">{moment(new Date(Number(message.created))).format("h:mm A | MMM, D")}</p>
                </div>
              </div>
            )
          })
        }
      </div>
      <MessageForm room={selectedRoom} currentUserId={currentUser.uid} />
    </Fragment>
  )
}

Messages.propTypes = {

}

export default Messages
