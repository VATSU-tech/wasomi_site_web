import { navbar_element } from "../data/content";

const Navbar = () => {
  return (
    <div className="drawer text-green-200 fixed z-10000000000000000000 font-bold text-2xl p-10">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div
          className="navbar navbar-st bg-black/40 shadow-xl w-full"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div
            className="mx-2 flex-1 ml-10 px-2"
            data-aos="zoom-in"
            data-aos-delay="120"
            data-aos-duration="1000"
          >
            WASOMI
          </div>
          <div className="hidden flex-none lg:block mr-10">
            <ul className="menu menu-horizontal flex-1 gap-4 p-10">
              {/* Navbar menu content here */}
              {navbar_element.map((elem) => (
                <li
                  data-aos="fade-down"
                  data-aos-delay={elem.delay}
                  data-aos-duration="1000"
                >
                  <a href={elem.content}>{elem.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Page content here*/}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul
          className="menu text-2xl text-white items-center bg-green-900/90 flex-col flex gap-2 min-h-full w-[70%] p-4"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          {/* Sidebar content here */}
          {navbar_element.map((elem) => (
            <li
              data-aos="fade-down"
              data-aos-delay={elem.delay}
              data-aos-duration="1000"
            >
              <a href={elem.content}>{elem.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
