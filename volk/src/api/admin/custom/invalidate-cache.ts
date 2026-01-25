import type {MedusaRequest, MedusaResponse} from '@medusajs/framework/http';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
	try {
		const frontendUrl = process.env.FRONTEND_URL;
		const cacheSecret = process.env.REVALIDATE_SECRET;

		if (!frontendUrl) {
			return res.status(500).json({error: 'FRONTEND_URL not configured'});
		}

		if (!cacheSecret) {
			return res.status(500).json({error: 'REVALIDATE_SECRET not configured'});
		}

		const body = req.body;

		const response = await fetch(`${frontendUrl}/api/revalidate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${cacheSecret}`
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));

			return res
				.status(response.status)
				.json({error: errorData.error || response.statusText});
		}

		const data = await response.json();

		return res.status(200).json(data);
	} catch (err) {
		console.error(err);

		return res.status(500).json({error: err instanceof Error ? err.message : 'Unknown error'});
	}
};
