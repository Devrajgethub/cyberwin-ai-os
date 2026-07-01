import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CyberWin AI OS — Web-Based Cyber Security Desktop',
  description: 'A web-based Linux/Windows-inspired cyber security desktop prototype with 26 apps, built with Next.js, TypeScript, and Tailwind CSS.',
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Override root layout body constraints for scrollable landing page */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              document.body.classList.remove('overflow-hidden', 'h-screen', 'w-screen');
              document.body.classList.add('overflow-x-hidden');
            })();
          `,
        }}
      />
      {children}
    </>
  );
}