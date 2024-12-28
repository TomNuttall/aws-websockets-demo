import QRCode from 'react-qr-code'
import './JoinLink.scss'

interface JoinLinkProps {
  url: string
  id: string
}

const JoinLink: React.FC<JoinLinkProps> = ({ url, id }) => {
  const link = `${url}?id=${id}`
  return (
    <div className="join-link">
      <div className="join-link__qr-code">
        <QRCode size={156} value={link} />
      </div>

      <span className="join-link__subtitle">Join Game</span>
    </div>
  )
}

export default JoinLink
