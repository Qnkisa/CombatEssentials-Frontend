function MissionCard({ title, description, path }: { title: string; description: string; path: string }) {
    return (
        <div class="bg-white shadow-md rounded-xl p-6 text-center flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
            <img src={path} class="w-36 h-36 object-cover"/>
            <h3 class="text-2xl font-semibold my-2 text-gray-800">{title}</h3>
            <p class="text-gray-600 text-sm">{description}</p>
        </div>
    );
}


function PersonCard({ name, imageSrc, quote }: { name: string; imageSrc: string; quote: string }) {
    return (
        <div class="flex flex-col items-center bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow duration-300">
            <img src={imageSrc} alt={name} class="w-60 h-60 object-cover rounded-full" />
            <h4 class="text-xl font-semibold text-gray-800 my-5">{name}</h4>
            <p class="italic text-gray-500 text-center mt-2 px-4 text-sm leading-relaxed lg:leading-loose">“{quote}”</p>
        </div>
    );
}


export default function About() {
    return (
        <div class="w-full">
            {/* Mission Section */}
            <div class="w-5/6 mx-auto my-20">
                <h2 class="text-5xl font-bold text-center mb-10 text-gray-800">Our Mission</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <MissionCard
                        title="Driven by Purpose"
                        description="Every challenge is an invitation to rise. We lead with focus, and we show up even when no one's watching."
                        path="/bullseye.png"
                    />
                    <MissionCard
                        title="Crafting Excellence"
                        description="Excellence isn’t a goal. It’s the only standard. We sweat the small stuff because every detail matters."
                        path="/throphy.png"
                    />
                    <MissionCard
                        title="Community First"
                        description="We rise by lifting others. Everything we do is rooted in teamwork, support, and collective progress."
                        path="/people.png"
                    />
                </div>
            </div>

            {/* People Section */}
            <div class="w-5/6 mx-auto my-20">
                <h2 class="text-4xl font-bold text-center mb-10 text-gray-800">Meet the People</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    <PersonCard
                        name="Dana Mitchell"
                        imageSrc="/dana.jpg"
                        quote="I’ve seen what hard work and faith can do. This team embodies both — it’s where potential meets purpose. What impresses me most isn't just the dedication to excellence, but the humility with which it's pursued. Everyone here has battled through their own trials, and yet they show up with open hands and hungry hearts. That’s rare. It’s more than just a company — it’s a movement driven by integrity, anchored in vision, and committed to leaving every space better than we found it."
                    />
                    <PersonCard
                        name="Dominic Carter"
                        imageSrc="/dc.jpg"
                        quote="Discipline isn't just something we preach — it’s how we live. You can feel it in the air around here. It shows up in the small moments, like showing up five minutes early, helping someone finish a late task, or doing things right when no one’s watching. The standard is high, but the culture makes you want to rise to it. It’s not about being perfect — it’s about being consistent, accountable, and always hungry to learn. This place pushes you to become more than just good at your craft. It pushes you to become a better human."
                    />
                    <PersonCard
                        name="Ariel Thompson"
                        imageSrc="/ariel.jpg"
                        quote="We’re not here to follow trends. We’re here to build a legacy rooted in values that matter. The world moves fast — too fast — and it’s easy to lose sight of what really counts. But not here. Here, we measure success by the impact we make, the lives we change, and the stories we help shape. Whether it's a small gesture or a major launch, we make sure it aligns with the heart of our mission. Every product, every decision, every person — it's all connected to a deeper why. That’s what keeps us grounded and moving forward."
                    />
                    <PersonCard
                        name="Anik Reyes"
                        imageSrc="/anik.jpg"
                        quote="What we create today echoes into generations. That weight keeps us sharp and honest. We don’t cut corners, not because we’re afraid of mistakes, but because we know our work matters. It sets a tone. It shapes expectations. It inspires someone we might never meet. And that’s the beauty of this place — we’re building with eternity in mind. Not just fast wins, but deep wins. The kind that outlast trends and outshine hype. That’s the kind of legacy I want to be part of, and this is the team that’s making it possible."
                    />
                    <PersonCard
                        name="Marcus Lee"
                        imageSrc="/onefc.jpg"
                        quote="Every move we make is for those who come after us. We’re laying bricks for the future. Sometimes that means long nights, tough conversations, or starting over until it's right. But we do it gladly — because we know what we’re building is bigger than any one of us. This place isn’t just about right now. It’s about creating a platform where future creators, fighters, builders, and leaders can find their footing and fly. That’s what makes this journey sacred. That’s what makes the hard days worth it."
                    />
                    <PersonCard
                        name="Raul Espinoza"
                        imageSrc="/raul.jpg"
                        quote="There’s power in unity. The grind is real, but it’s easier when you’re never walking alone. We lift each other up — not just in work, but in life. We celebrate each other’s wins and carry each other through the lows. That’s rare. That’s priceless. This culture isn’t accidental — it’s built through trust, through service, and through a shared commitment to something greater than ourselves. I’ve worked a lot of places, but none like this. Here, you don’t just find teammates. You find a second family."
                    />
                </div>
            </div>
        </div>
    );
}
