interface TransferRestrictionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TransferRestrictionModal({ isOpen, onClose }: TransferRestrictionModalProps) {
  if (!isOpen) return null

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/16722848285', '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 rounded-2xl shadow-2xl max-w-md w-full p-8 border-2 border-red-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-600 hover:text-red-800 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 transition-colors"
          aria-label="Close"
        >
          ×
        </button>

        {/* Content */}
        <div className="mt-4 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-500 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-4">Transfer Restricted</h2>
            <p className="text-red-900 text-lg mb-6">
              Sorry, you can not transfer with your account!
            </p>
          </div>

          <div className="bg-white bg-opacity-60 rounded-xl p-6 mb-6">
            <p className="text-red-900 font-semibold mb-4">Contact us:</p>
            <div className="space-y-3">
              <a 
                href="mailto:info@bvalimited.online"
                className="block text-blue-600 hover:text-blue-800 font-medium underline"
              >
                info@bvalimited.online
              </a>
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp: +16722848285
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
