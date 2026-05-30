import { Link } from 'react-router-dom';
import { ArrowRight, Package, Shield, Truck } from 'lucide-react';
import { Button } from '../components/ui';

export function Landing() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-950">
      <header className="flex shrink-0 items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500">
            <Truck className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Delivery System</span>
        </div>
        <div className="flex gap-2">
          <Link to="/login">
            <Button variant="ghost" className="!text-slate-300 hover:!bg-white/10 hover:!text-white">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="!bg-brand-500 hover:!bg-brand-400">Get Started</Button>
          </Link>
        </div>
      </header>

      <div className="scroll-area flex flex-1 items-center">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-8 py-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-300">
              Smart Delivery Platform
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white lg:text-5xl">
              Deliver faster.
              <span className="block text-brand-400">Manage smarter.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-400">
              Orders, drivers, payments and reports — one professional system for your entire delivery
              operation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button className="!px-6">
                  Start free <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="!border-slate-600 !bg-slate-800 !text-slate-200">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Package, title: 'Online Orders', desc: 'Customers order in seconds' },
              { icon: Truck, title: 'Live Tracking', desc: 'Assign & track drivers' },
              { icon: Shield, title: 'Secure Roles', desc: 'Admin, customer, driver' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur"
              >
                <Icon className="mb-3 h-8 w-8 text-brand-400" />
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-1 text-sm text-slate-500">{desc}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-brand-600/20 to-slate-900 p-5 sm:col-span-2">
              <p className="text-xs font-semibold uppercase text-brand-300">Demo login</p>
              <p className="mt-2 text-sm text-slate-400">
                admin@delivery.com / Admin@123 · customer1@test.com / Customer@123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
