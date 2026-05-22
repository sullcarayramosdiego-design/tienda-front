import Link from 'next/link';

const accountLinks = [
  { href: '/account', label: 'Overview' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/loyalty', label: 'Loyalty' },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 lg:grid-cols-4">
        <aside className="space-y-2">
          {accountLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 rounded hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
        </aside>
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
