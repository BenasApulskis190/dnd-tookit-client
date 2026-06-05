<template>
	<div
		className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4"
	>
		<div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
			<div className="text-center mb-8">
				<div
					className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-4"
				>
					<svg
						className="w-10 h-10 text-white"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path
							d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
						/>
						<polyline points="9 22 9 12 15 12 15 22" />
					</svg>
				</div>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Welcome to NutriPlan
				</h1>
				<p className="text-gray-600">
					Your personal nutrition planning assistant
				</p>
			</div>

			<div className="space-y-4">
				<button
					className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all group"
				>
					<span className="font-medium text-gray-900"
						>Continue with Google</span
					>
				</button>
			</div>
		</div>
	</div>
</template>
