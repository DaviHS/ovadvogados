import Image from "next/image"

export default function Footer() {
	return (
	<footer className="bg-gray-900 text-gray-400 py-12">
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
			<div>
				<div className="flex items-center gap-3 mb-4">
					<Image
						src="/logo-aviao.png"
						alt="RampSync"
						width={40}
						height={40}
						className="object-contain"
					/>
					<span className="text-xl font-bold text-white">RampSync</span>
				</div>

				<p className="text-sm">
					Soluções completas de automação para operações aeroportuárias.
				</p>
			</div>

		<div>
			<h4 className="text-white font-semibold mb-4">Soluções</h4>
			<ul className="space-y-2 text-sm">
			<li><a href="#solucoes" className="hover:text-white">Automação</a></li>
			<li><a href="#beneficios" className="hover:text-white">Benefícios</a></li>
			<li><a href="#contato" className="hover:text-white">Contato</a></li>
			</ul>
		</div>
		</div>

		<div className="mt-12 text-center text-sm text-gray-500">
		© {new Date().getFullYear()} RampSync. Todos os direitos reservados.
		</div>
	</footer>
	)
}
