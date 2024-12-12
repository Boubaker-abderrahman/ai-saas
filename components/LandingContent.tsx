import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const testimonials = [
    {
        name : "Jhon",
        title : "fullstack Developer",
        description : "one of the best AI product I have ever Used",

    },{
        name : "Francois",
        title : "Frontend Developer",
        description : "I found this app Easy to use and very efficient",

    },{
        name : "Camila",
        title : "React Developer",
        description : "Very interesting app",

    },{
        name : "Ahmed",
        title : "senior Developer",
        description : "one of the best AI product I have ever Used",

    },{
        name : "Mohamed",
        title : "fullstack Developer",
        description : "one of the best AI product I have ever Used",

    },
]

export const LandingContent = () => {
    return (
        <div className="px-10 pb-20">
            <h2 className="text-center text-4xl text-white font-extrabold mb-10">
                Testimonials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {testimonials.map((item)=>(
                    <Card key={item.description} className="bg-[#192339] border-none text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">
                                <div>
                                    <p className="text-lg">{item.name}</p>
                                    <p className="text-zinc-400 text-sm">{item.title}</p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {item.description}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )};

export default LandingContent
