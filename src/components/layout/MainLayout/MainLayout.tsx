import Navbar from "@/components/ui/Navbar/Navbar"

export default function MainLayout({children}: any) {
    return (
        <div>
            <Navbar/>
            <main>
                {children}
            </main>
        </div>
    )
}