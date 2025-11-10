import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>Next Dev</p>
        </Link>

        <ul>
          <Link href="/">home</Link>
          <Link href="/">events</Link>
          <Link href="/event">create events</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
