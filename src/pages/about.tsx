// import Image from 'next/image'
import Link from 'next/link'

const About = () => (
  <section>
    <h1 className="homepage-header">About EV Equity Roadmap</h1>
    <p>
      This tool is intended for free use by local governments and stakeholders to identify high-priority,
      high-feasibility sites for investment in electric vehicle charging and associated mobility
      infrastructure. It is a joint project of UC Berkeley&apos;s Energy and Resources Group and Center for
      Law, Energy & the Environment (CLEE) as part of CLEE&apos;s{' '}
      <a href="https://www.law.berkeley.edu/research/clee/ev-equity/"> EV Equity Initiative</a>. This is a
      demonstration tool; all data still subject to verification. All data acquired from public sources except
      as noted.
    </p>
    <p className="my-2">Initial funding provided by UC Berkeley Institute for Transportation studies.</p>
    <h2 className="text-2xl font-bold my-4">Leadership Team</h2>
    <div className="grid grid-cols-12 gap-4">
      {/* <div className="col-span-2">
        <Link className="font-bold" href="https://erg.berkeley.edu/people/kammen-daniel-m/">
          <img src="/images/dkammen.png" alt="Dan Kammen" width={100} height={130} />
        </Link>
      </div> */}
      <div className="col-span-10 flex flex-col justify-center">
        <Link className="font-bold" href="https://erg.berkeley.edu/people/kammen-daniel-m/">
          Dan Kammen
        </Link>
        <p>Professor of Energy</p>
        <p>Energy & Resources Group and Goldman School of Public Policy, UC Berkeley</p>
      </div>
      {/* <div className="col-span-2">
        <Link className="font-bold" href="https://www.law.berkeley.edu/research/clee/about/people/ted-lamm/">
          <img src="/images/tlamm.png" alt="Ted Lamm" width={100} height={130} />
        </Link>
      </div> */}
      <div className="col-span-10 flex flex-col justify-center">
        <Link className="font-bold" href="https://www.law.berkeley.edu/research/clee/about/people/ted-lamm/">
          Ted Lamm
        </Link>
        <p>Associate Director</p>
        <p>Center for Law, Energy & the Environment, UC Berkeley School of Law</p>
      </div>
      {/* <div className="col-span-2">
        <Link className="font-bold" href="https://www.law.berkeley.edu/research/clee/about/people/ken-alex/">
          <img src="/images/kalex.png" alt="Ken Alex" width={100} height={130} />
        </Link>
      </div> */}
      <div className="col-span-10 flex flex-col justify-center">
        <Link className="font-bold" href="https://www.law.berkeley.edu/research/clee/about/people/ken-alex/">
          Ken Alex
        </Link>
        <p>Director, Project Climate</p>
        <p>Center for Law, Energy & the Environment, UC Berkeley School of Law</p>
      </div>
    </div>
    <h2 className="text-2xl font-bold my-4">Lead Designers</h2>
    <ul className="space-y-4">
      <li>
        <p className="font-semibold text-lg">Ari Ball-Burack</p>
        <p>PhD candidate, Energy & Resources Group, UC Berkeley</p>
      </li>
      <li>
        <p className="font-semibold text-lg">Meagan Marie LeBerth</p>
        <p>MS candidate, Energy & Resources Group, UC Berkeley</p>
      </li>
      <li>
        <p className="font-semibold text-lg">Brad Rhymer</p>
        <p>MDevEng candidate, Development Engineering, UC Berkeley</p>
      </li>
      <li>
        <p className="font-semibold text-lg">Ankita Suresh Shanbhag</p>
        <p>MIMS 2024, UC Berkeley School of Information</p>
      </li>
    </ul>

    <h3 className="text-xl font-bold mt-6 mb-2">Other Research Credits</h3>
    <p>Eleanor Adachi, Radhika Agarwal, Aki Konno</p>
  </section>
)

export default About
