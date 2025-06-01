import NavBarProps from '@lib/NavBarProps'

const Footer: React.FC<NavBarProps> = ({ setCurrentView }) => (
  <footer className="mt-4 w-full bg-light h-44">
    <section className="sm:mx-8 md:mx-12 lg:mx-16">
      <p className="py-3 ">
        This tool is a joint project of UC Berkeley&apos;s Energy and Resources Group and Center for Law,
        Energy & the Environment. See
        <button
          onClick={() => setCurrentView('about')}
          className="mx-1 bg-transparent border-none text-primary underline cursor-pointer"
          type="button"
        >
          About
        </button>
        for more information.
      </p>

      <div className="flex items-center justify-between gap-4">
        <div className="flex justify-center align-center">
          <img
            src="/images/Berk-ERG.png"
            alt="Berk-ERG Logo"
            className="h-14 object-contain"
            // style="height: 40px; width: auto;"
          />
        </div>
        <div className="flex justify-center align-center">
          <img
            src="/images/Berk-CLEE.png"
            alt="Berk-CLEE Logo"
            className="h-14 object-contain"
            // style="height: 40px; width: auto;"
          />
        </div>
        <div className="flex justify-center align-center">
          <img
            src="/images/Berk-ITS.png"
            alt="Berk-ITS Logo"
            className="h-24 object-contain"
            // style="height: 40px; width: auto;"
          />
        </div>
      </div>
      <p className="text-base mb-2">© 2024 All rights reserved.</p>
    </section>
  </footer>
)

export default Footer
