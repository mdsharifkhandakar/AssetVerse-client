import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Users,
  Workflow,
  BarChart3,
  Package,
  ClipboardCheck,
  Layers,
  RefreshCcw,
  LayoutDashboard,
  PieChart,
  UserPlus,
  Boxes,
  TrendingUp,
  Star,
  Check,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  BadgeCheck,
  Rocket,
} from 'lucide-react';
import RobotLoader from '../components/RobotLoader/RobotLoader';
import '../components/RobotLoader/RobotLoader.css';

const API_URL = import.meta.env.VITE_API_URL || '';

const FALLBACK_PACKAGES = [
  {
    name: 'Basic',
    employeeLimit: 5,
    price: 5,
    features: ['Asset Tracking', 'Employee Management', 'Basic Support'],
  },
  {
    name: 'Standard',
    employeeLimit: 10,
    price: 8,
    features: ['All Basic features', 'Advanced Analytics', 'Priority Support'],
  },
  {
    name: 'Premium',
    employeeLimit: 20,
    price: 15,
    features: ['All Standard features', 'Custom Branding', '24/7 Support'],
  },
];

const SectionHeading = ({ badge, title, subtitle, light = false }) => (
  <div className="text-center max-w-3xl mx-auto mb-14">
    <span
      className={`inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full ${
        light
          ? 'bg-white/15 text-white border border-white/25'
          : 'bg-blue-600/10 text-blue-600 border border-blue-600/20'
      }`}
    >
      {badge}
    </span>

    <h2
      className={`mt-4 text-3xl md:text-4xl font-extrabold tracking-tight ${
        light
          ? 'text-white'
          : 'bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent'
      }`}
    >
      {title}
    </h2>

    {subtitle && (
      <p
        className={`mt-4 text-base leading-relaxed ${
          light ? 'text-white/85' : 'text-base-content/70'
        }`}
      >
        {subtitle}
      </p>
    )}
  </div>
);

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axios.get(`${API_URL}/packages`);

        if (Array.isArray(res.data) && res.data.length > 0) {
          setPackages(res.data);
        } else {
          setPackages(FALLBACK_PACKAGES);
        }
      } catch {
        setPackages(FALLBACK_PACKAGES);
      } finally {
        setPackagesLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const benefits = [
    {
      icon: ShieldCheck,
      title: 'Enterprise-Grade Security',
      desc: 'Role-based access, audit-ready records, and encrypted sessions keep every asset and employee record protected.',
      accent: 'from-blue-600 to-cyan-500',
    },
    {
      icon: Workflow,
      title: 'Streamlined Workflows',
      desc: 'Request → approve → assign → return in one place. Less paperwork, fewer lost items, faster handoffs.',
      accent: 'from-blue-500 to-orange-500',
    },
    {
      icon: BarChart3,
      title: 'Actionable Analytics',
      desc: 'Live dashboards show utilization, pending requests, and team activity so HR can decide with confidence.',
      accent: 'from-orange-500 to-amber-500',
    },
    {
      icon: Users,
      title: 'Built for Growing Teams',
      desc: 'Employee limits, multi-role dashboards, and clear ownership help companies scale without chaos.',
      accent: 'from-indigo-500 to-blue-600',
    },
  ];

  const features = [
    {
      icon: Package,
      title: 'Asset Assignment',
      desc: 'Assign laptops, furniture, and tools with clear ownership and history tracking.',
    },
    {
      icon: ClipboardCheck,
      title: 'Request Approvals',
      desc: 'Employees request in one click; HR reviews, approves, and notifies instantly.',
    },
    {
      icon: Layers,
      title: 'Multi-Company Support',
      desc: 'Separate companies and departments so every organization stays organized.',
    },
    {
      icon: RefreshCcw,
      title: 'Return Tracking',
      desc: 'Monitor returns, maintenance, and reassignments with full lifecycle visibility.',
    },
    {
      icon: LayoutDashboard,
      title: 'Employee Dashboard',
      desc: 'Personal space for employees to view assigned assets and submit requests.',
    },
    {
      icon: PieChart,
      title: 'HR Analytics',
      desc: 'Insightful charts for inventory health, request volume, and team usage.',
    },
  ];

  const stats = [
    { value: '100+', label: 'Companies Trust Us', icon: BadgeCheck },
    { value: '10k+', label: 'Assets Managed', icon: Boxes },
    { value: '5k+', label: 'Active Employees', icon: Users },
    { value: '99%', label: 'Client Satisfaction', icon: Star },
  ];

  const testimonials = [
    {
      quote:
        'AssetVerse cut our asset audit time from days to hours. The approval flow alone paid for the subscription.',
      name: 'Sarah Mitchell',
      role: 'HR Director',
      company: 'Northline Logistics',
      initials: 'SM',
    },
    {
      quote:
        'We finally know where every laptop lives. Employee handoffs are clean and fully tracked.',
      name: 'James Carter',
      role: 'Operations Lead',
      company: 'BrightPath Studios',
      initials: 'JC',
    },
    {
      quote:
        'Onboarding used to mean spreadsheet chaos. Now new hires get assets assigned the same day.',
      name: 'Ayesha Rahman',
      role: 'People Ops Manager',
      company: 'Vertex Digital',
      initials: 'AR',
    },
  ];

  const steps = [
    {
      icon: UserPlus,
      title: 'Create Your Workspace',
      desc: 'Register your company, invite HR and employees, and choose a package that fits your team size.',
    },
    {
      icon: Boxes,
      title: 'Add & Assign Assets',
      desc: 'Catalog inventory, assign to employees, and manage requests from a single dashboard.',
    },
    {
      icon: TrendingUp,
      title: 'Track & Optimize',
      desc: 'Use analytics and return tracking to reduce waste and keep every item accounted for.',
    },
  ];

  const faqs = [
    {
      q: 'What is AssetVerse?',
      a: 'AssetVerse is a corporate asset management platform that helps HR teams track, assign, and optimize company equipment while giving employees a clear view of what they own.',
    },
    {
      q: 'How do packages and pricing work?',
      a: 'We offer Basic, Standard, and Premium packages based on employee limits. Each package includes asset tracking, employee management, and support features that scale with your team.',
    },
    {
      q: 'Can employees request assets themselves?',
      a: 'Yes. Employees submit requests from their dashboard. HR reviews and approves or declines with full request history for auditability.',
    },
    {
      q: 'Is my company data secure?',
      a: 'Security is a priority. We use role-based access control, authenticated sessions, and encrypted connections to protect company and employee data.',
    },
    {
      q: 'Can I upgrade later?',
      a: 'Absolutely. Start with any package and upgrade anytime as your team grows — your existing assets and history stay intact.',
    },
  ];

  return (
    <div className="overflow-hidden">
      <title>AssetVerse — Corporate Asset Management</title>

      {/* hero section*/}
      <section className="relative bg-gradient-to-r from-blue-600 to-orange-500 text-white py-20 min-h-[50vh] lg:py-40 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-30"
          >
            <source src="https://v1.pinimg.com/videos/mc/720p/54/72/f5/5472f5ebe72c6e33c0ab3e8c684566f3.mp4" />
          </video>

          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center space-y-6"
          >
            <h1 className="text-2xl md:text-6xl font-extrabold drop-shadow-lg">
              Manage Company Assets with{' '}
              <span className="text-orange-300">AssetVerse</span>
            </h1>

            <p className="text-gray-50 text-[16px] md:text-xl max-w-2xl mx-auto drop-shadow-md">
              Track, assign, and organize your corporate assets efficiently —
              built for HR teams and employees.
            </p>

            <Link
              to="/login"
              className="btn bg-base-100 text-blue-600 hover:bg-base-200 border-0 text-lg px-4 py-2 rounded-full shadow-lg"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>


    {/* benefits section */}
      <section className="py-20 bg-base-100 relative">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="About AssetVerse"
            title="Why Modern Companies Choose AssetVerse"
            subtitle="Built for organizations that need clear ownership, faster approvals, and zero-lost-asset operations."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((item, idx) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: idx * 0.1,
                  duration: 0.5,
                }}
                whileHover={{ y: -8 }}
                className="group card bg-base-100 border border-base-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.accent} scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}
                />

                <div className="card-body items-center text-center p-7">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.accent} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <item.icon className="text-white" size={28} />
                  </div>

                  <h3 className="card-title text-lg font-bold justify-center">
                    {item.title}
                  </h3>

                  <p className="text-sm text-base-content/70 leading-relaxed mt-2">
                    {item.desc}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>



     {/* pricing section*/}
      <section className="py-20 bg-base-200 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_55%)]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="Pricing"
            title="Subscription Packages"
            subtitle="Simple, transparent plans. Packages load dynamically from our database — pick what fits your team."
          />

          {packagesLoading ? (
            <div className="flex justify-center py-16">
              <RobotLoader />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
              {packages.map((pkg, idx) => {
                const isPopular =
                  idx === 1 || String(pkg.name).toLowerCase() === 'standard';

                return (
                  <motion.div
                    key={pkg._id || pkg.name || idx}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: idx * 0.12,
                      duration: 0.55,
                    }}
                    className={`relative rounded-2xl p-[2px] h-full ${
                      isPopular
                        ? 'bg-gradient-to-b from-blue-600 via-cyan-500 to-orange-500 shadow-2xl md:-translate-y-4'
                        : 'bg-base-300'
                    }`}
                  >
                    {isPopular && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-blue-600 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                        Most Popular
                      </span>
                    )}

                    <div className="card bg-base-100 h-full rounded-2xl">
                      <div className="card-body flex flex-col justify-between p-7">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-extrabold">
                              {pkg.name}
                            </h3>

                            <span
                              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                isPopular
                                  ? 'bg-orange-100 text-orange-600'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {pkg.name}
                            </span>
                          </div>

                          <div className="my-5">
                            <span className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                              ${pkg.price}
                            </span>

                            <span className="text-sm text-base-content/50 font-medium">
                              {' '}
                              / month
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm font-semibold text-base-content/80 mb-5 bg-base-200 rounded-lg px-3 py-2">
                            <Users size={16} className="text-blue-600" />
                            Up to{' '}
                            <span className="font-bold text-blue-700">
                              {pkg.employeeLimit}
                            </span>{' '}
                            Employees
                          </div>

                          <ul className="space-y-3 mb-6">
                            {(pkg.features || []).map((f, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2.5 text-sm text-base-content/80"
                              >
                                <span
                                  className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                    isPopular
                                      ? 'bg-gradient-to-r from-blue-600 to-orange-500'
                                      : 'bg-blue-600'
                                  }`}
                                >
                                  <Check
                                    size={12}
                                    className="text-white"
                                    strokeWidth={3}
                                  />
                                </span>

                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Link
                          to="/login"
                          className={`btn w-full rounded-xl font-semibold border-none ${
                            isPopular
                              ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white hover:from-blue-700 hover:to-orange-600'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          Choose {pkg.name}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>



      {/* features section*/}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="Features"
            title="Powerful Features, Clean Layout"
            subtitle="Everything your HR team needs to control inventory and give employees a frictionless experience."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: idx * 0.08,
                  duration: 0.45,
                }}
                className="group card bg-base-100 border border-base-300 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300"
              >
                <div className="card-body p-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-orange-500 group-hover:text-white transition-all">
                    <f.icon size={24} />
                  </div>

                  <h3 className="card-title text-base font-bold">{f.title}</h3>

                  <p className="text-sm text-base-content/65 leading-relaxed mt-1">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


     {/* stats section*/}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==')]" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, idx) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-6"
              >
                <s.icon className="mx-auto text-amber-300 mb-3" size={28} />

                <div className="text-3xl md:text-4xl font-extrabold text-white">
                  {s.value}
                </div>

                <div className="mt-1 text-sm text-white/80 font-medium">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

          

      {/* testimonials section*/}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="Testimonials"
            title="Trusted by Growing Companies"
            subtitle="Real teams use AssetVerse every day to keep equipment accountable."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: idx * 0.12,
                  duration: 0.5,
                }}
                className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-lg transition-shadow p-6 relative"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <blockquote className="text-sm text-base-content/75 leading-relaxed italic mb-5">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <figcaption className="flex items-center gap-3 mt-auto">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 text-white flex items-center justify-center font-bold text-sm">
                    {t.initials}
                  </div>

                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>

                    <div className="text-xs text-base-content/60">
                      {t.role} · {t.company}
                    </div>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>



    {/* how it works section*/}
      <section className="py-20 bg-base-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            badge="How It Works"
            title="Three Simple Steps"
            subtitle="From signup to full visibility — go live without a long implementation."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* line */}
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-orange-500 opacity-40" />

            {steps.map((s, idx) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: idx * 0.15,
                  duration: 0.5,
                }}
                className="relative text-center px-4"
              >
                <div className="relative z-10 mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-orange-500 text-white flex items-center justify-center shadow-xl mb-5">
                  <s.icon size={32} />

                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-base-100 text-blue-700 text-sm font-extrabold flex items-center justify-center border-2 border-blue-600 shadow">
                    {idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-2">{s.title}</h3>

                <p className="text-sm text-base-content/65 leading-relaxed max-w-xs mx-auto">
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



    {/* faq section*/}
      <section className="py-20 bg-base-200">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeading
            badge="FAQ"
            title="Frequently Asked Questions"
            subtitle="Quick answers to the questions teams ask most."
          />

          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className={`rounded-xl border transition-all ${
                    isOpen
                      ? 'border-blue-400 bg-base-100 shadow-md'
                      : 'border-base-300 bg-base-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-sm md:text-base">
                      {item.q}
                    </span>

                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-blue-600 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: 'auto',
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.28,
                          ease: 'easeInOut',
                        }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-base-content/70 leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      
          
    {/* contact section*/}
      <section className="relative py-20 bg-gradient-to-br from-blue-700 via-blue-600 to-orange-500 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-56 h-56 rounded-full bg-amber-300 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 px-4 py-1.5 rounded-full text-sm font-medium mb-5">
              <Rocket size={16} className="text-amber-300" />
              Start in minutes — no complex setup
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              Ready to Get Started with{' '}
              <span className="text-amber-300">AssetVerse</span>?
            </h2>

            <p className="text-white/90 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Join 100+ companies that trust AssetVerse to track equipment,
              empower employees, and keep operations audit-ready.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <Link
                to="/join-hr"
                className="btn bg-white text-blue-700 border-0 hover:bg-base-200 px-8 rounded-full font-bold shadow-lg"
              >
                Join as HR Manager
              </Link>

              <Link
                to="/join-employee"
                className="btn bg-black/25 text-white border border-white/40 hover:bg-black/40 px-8 rounded-full font-bold backdrop-blur-sm"
              >
                Join as Employee
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-white/85">
              <span className="inline-flex items-center gap-2">
                <Mail size={15} />
                support@assetverse.com
              </span>

              <span className="inline-flex items-center gap-2">
                <Phone size={15} />
                +1 (555) 012-3456
              </span>

              <span className="inline-flex items-center gap-2">
                <MapPin size={15} />
                Available worldwide
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
