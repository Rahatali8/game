import { PageHeader } from '@/components/layout/PageHeader'
import { Flame } from 'lucide-react'

export default function AboutUsPage() {
  return (
    <div>
      <PageHeader title="About Us" />
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}>
              <Flame size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-ink">CloudSky</h1>
              <p className="text-xs text-ink-muted">Crystal Mining Platform</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-ink-soft leading-relaxed">
            <p>
              CloudSky is a cutting-edge cloud mining investment platform that allows users to earn passive income through cryptocurrency mining without owning physical hardware.
            </p>
            <p>
              Our platform leverages state-of-the-art mining infrastructure to deliver consistent daily returns to our investors. We operate mining farms across multiple countries including Kazakhstan, Iceland, Japan, and China.
            </p>
            <p>
              <strong className="text-ink">Our Mission:</strong> To make cryptocurrency mining accessible to everyone, providing transparent, reliable, and profitable mining services.
            </p>
            <p>
              <strong className="text-ink">Founded:</strong> 2023 · Registered in UAE
            </p>
            <p>
              <strong className="text-ink">Team Members:</strong> 50+ professionals worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
