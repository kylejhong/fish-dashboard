import { Outlet, Link } from "react-router-dom"

const Layout = () => {
    return (
        <div className="main-content">
            <div className="background-image"></div>
            <div className="random-image-bkg-list"></div>
            <div className="random-image-bkg-list2"></div>
            <div className="background-image2"></div>
            <div className="container">
            <div className="header">
                <div>Fish Finder</div>
                <Link className="link" to="/">
                    <div>Dashboard</div>
                </Link>
            </div>
            <Outlet/>
        </div>
      </div>
    )
}

export default Layout