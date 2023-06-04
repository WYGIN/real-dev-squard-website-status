const cors = require('cors');
module.exports = {
	middleware: [
    		cors({
      			origin: "*",
    		}),
  	],
	async headers() { 
		return [ 
			{ 
				source: '/', 
				headers: [
					{ 
						key: 'Access-Control-Allow-Origin', 
						value: '*' //'*'
					}
				]	
			},
			{ 
				source: '/(.*)', 
				headers: [
					{ 
						key: 'Access-Control-Allow-Origin', 
						value: '*' //'*'
					}
				]	
			}, 
			{ 
				source: '/progress/:id', 
				headers: [
					{ 
						key: 'Access-Control-Allow-Origin', 
						value: '*' //'*' 
					}
				]
			},
			{ 
				source: '/tasks/:id', 
				headers: [
					{ 
						key: 'Access-Control-Allow-Origin', 
						value: '*' 
					}
				] 
			},
			{ 
				source: '/tasks/:id/details', 
				headers: [
					{ 
						key: 'Access-Control-Allow-Origin', 
						value: '*' 
					}
				] 
			},
			{ 
				source: '/tasks/:id/(.*)', 
				headers: [
					{ 
						key: 'Access-Control-Allow-Origin', 
						value: '*' 
					}
				] 
			},
		]
	},
	images: {
		domains: ['raw.githubusercontent.com', 'res.cloudinary.com'],
	},
};
