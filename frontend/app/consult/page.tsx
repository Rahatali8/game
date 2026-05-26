import { PageHeader } from '@/components/layout/PageHeader'
import { MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'

export default function ConsultPage() {
  return (
    <div>
      <PageHeader title="Customer Service" />
      <div className="px-4 mt-4 space-y-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">👨‍💼</span>
          </div>
          <h2 className="font-extrabold text-lg text-ink">CloudFire Support</h2>
          <p className="text-ink-soft text-sm mt-1">24/7 Customer Service</p>

          <div className="mt-6 space-y-3">
            <Link href="/message"
              className="flex items-center gap-3 bg-brand-50 border border-brand-200 rounded-2xl p-4 hover:bg-brand-100 transition-colors">
              <MessageCircle size={22} className="text-brand-600 flex-shrink-0" />
              <div className="text-left">
                <p className="font-bold text-sm text-ink">Live Chat</p>
                <p className="text-xs text-ink-muted">Chat with our support team</p>
              </div>
            </Link>

            <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
              <Phone size={22} className="text-ink-soft flex-shrink-0" />
              <div className="text-left">
                <p className="font-bold text-sm text-ink">WhatsApp</p>
                <p className="text-xs text-ink-muted">+92 300 1234567</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <h3 className="font-extrabold text-sm text-ink mb-3">Working Hours</h3>
          <div className="space-y-2 text-xs text-ink-soft">
            <div className="flex justify-between"><span>Monday – Friday</span><span className="font-semibold text-ink">9:00 AM – 10:00 PM</span></div>
            <div className="flex justify-between"><span>Saturday</span><span className="font-semibold text-ink">10:00 AM – 8:00 PM</span></div>
            <div className="flex justify-between"><span>Sunday</span><span className="font-semibold text-ink">12:00 PM – 6:00 PM</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
