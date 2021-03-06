import { useState } from 'react'
import classnames from 'classnames'
import pluralize from 'pluralize'
import useGlobalState from 'hooks/useGlobalState'
import { HiOutlineKey, HiOutlineTrash } from 'react-icons/hi'
import find from 'lodash/find'

const TrashIcon = ({ className, ...props }) => (
  <HiOutlineTrash
    className={classnames('inline w-6 h-6 cursor-pointer right-0 absolute', className)}
    title='Remove'
    {...props}
  />
)

export function CommittedVotes({ committedVotes = [], images = [], ...params }) {
  const [open, setOpen] = useState(false)
  if (committedVotes.length < 1) return null
  return (
    <>
      <h3 className='text-xl text-center cursor-pointer select-none' onClick={_ => setOpen(!open)}>
        {committedVotes.length} Commited Votes
      </h3>
      {open &&
        committedVotes.map((item, i) => {
          if (item.type === 'keychange') {
            return (
              <div className='relative text-left text-white cursor-default' key={i}>
                <HiOutlineKey className='inline w-6 h-6 ml-1 mr-3' stroke='yellow' /> Change key
              </div>
            )
          } else {
            return (
              <div className='relative text-left text-white cursor-default' key={i}>
                <div
                  className='inline-block w-8 h-8 mr-3 align-middle bg-cover rounded'
                  style={{
                    backgroundImage: `url(${find(images, ['index', item.imageId]).url})`,
                  }}
                />
                {item.voteSquare} {pluralize('credit', item.voteSquare)} for #{item.imageId}
              </div>
            )
          }
        })}
    </>
  )
}

export default function Cart() {
  const [state, actions] = useGlobalState()
  const { cart, images, committedVotes, loading } = state
  const { vote, removeFromCart } = actions

  return (
    <div className='w-56 space-y-6 text-right'>
      <CommittedVotes committedVotes={committedVotes} images={images} />
      <h3 className='text-xl text-center'>
        {cart.length > 0 ? `${cart.length} Pending ${pluralize('Action', cart.length)}` : null}
      </h3>
      {cart.map((item, i) => {
        if (item.type === 'keychange') {
          return (
            <div
              className='relative text-left text-white cursor-default'
              key={i}
              title={item.keyPair.pubKey.serialize()}>
              <HiOutlineKey className='inline w-6 h-6 ml-1 mr-3' stroke='yellow' /> Change key
              <TrashIcon onClick={_ => removeFromCart(i)} />
            </div>
          )
        } else {
          const image = find(images, ['index', item.imageId])
          return (
            <div className='relative text-left text-white cursor-default' key={i}>
              <div
                className='inline-block w-8 h-8 mr-3 align-middle bg-cover rounded'
                style={{
                  backgroundImage: `url(${image.url})`,
                  backgroundColor: image.color,
                }}
              />
              {item.voteSquare} {pluralize('credit', item.voteSquare)} for #{item.imageId}{' '}
              <TrashIcon onClick={_ => removeFromCart(i)} />
            </div>
          )
        }
      })}

      {Boolean(cart.length) && (
        <a
          className={classnames('block w-full px-6 text-center button select-none', {
            'cursor-wait': loading,
          })}
          onClick={vote}>
          {loading ? 'Voting…' : 'Vote'}
        </a>
      )}
    </div>
  )
}
