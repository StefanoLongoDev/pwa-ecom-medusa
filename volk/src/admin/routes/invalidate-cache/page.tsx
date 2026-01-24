import { Container, Button, Checkbox, Heading, Text } from "@medusajs/ui"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useState } from "react"

const tagsList = [
	"products",
	"collections",
	"orders",
	"pages",
	"storefront",
]

const InvalidateCachePage = () => {
	const [selected, setSelected] = useState<string[]>([])
	const [loading, setLoading] = useState(false)
	const [statusMsg, setStatusMsg] = useState("")

	const toggleTag = (tag: string) => {
		setSelected(prev =>
			prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
		)
	}

	const submitInvalidate = async () => {
		setLoading(true)
		setStatusMsg("")

		try {
			const frontendUrl = import.meta.env.VITE_CACHE_INVALIDATION_URL || ""
			const cacheSecret = import.meta.env.VITE_CACHE_INVALIDATION_SECRET || ""

			if (!frontendUrl) {
				throw new Error("VITE_CACHE_INVALIDATION_URL not configured")
			}

			if (!cacheSecret) {
				throw new Error("VITE_CACHE_INVALIDATION_SECRET not configured")
			}

			const revalidateUrl = `${frontendUrl}/api/revalidate`

			// If all tags are selected, invalidate all
			if (selected.length === tagsList.length) {
				const res = await fetch(revalidateUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${cacheSecret}`,
					},
					body: JSON.stringify({ all: true }),
				})

				if (!res.ok) {
					const errorData = await res.json().catch(() => ({}))
					throw new Error(`HTTP Error: ${res.status} - ${errorData.error || res.statusText}`)
				}

				const data = await res.json()
				setStatusMsg(data.message || "Cache invalidated successfully for all tags!")
			} else {
				// Invalidate each selected tag
				const results = await Promise.allSettled(
					selected.map(tag =>
						fetch(revalidateUrl, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"Authorization": `Bearer ${cacheSecret}`,
							},
							body: JSON.stringify({ tag }),
						})
					)
				)

				const failed = results.filter(r => r.status === "rejected" || (r.status === "fulfilled" && !r.value.ok))

				if (failed.length > 0) {
					const errorMessages = await Promise.all(
						failed.map(async (r) => {
							if (r.status === "rejected") return r.reason?.message || "Unknown error"
							try {
								const errorData = await r.value.json()
								return errorData.error || `HTTP ${r.value.status}`
							} catch {
								return `HTTP ${r.value.status}`
							}
						})
					)
					throw new Error(`Some invalidations failed: ${errorMessages.join(", ")}`)
				}

				setStatusMsg(`Cache invalidated successfully for ${selected.length} tag(s)!`)
			}
		} catch (err) {
			console.error(err)
			setStatusMsg(err instanceof Error ? err.message : "Error during invalidation.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<Container className="p-6 space-y-6">
			<Heading level="h2">Invalidate Cache</Heading>
			<Text>Select which cache tags to clear:</Text>

			<div className="flex flex-col gap-3">
				{tagsList.map(tag => (
					<label key={tag} className="flex items-center gap-2 cursor-pointer">
						<Checkbox
							checked={selected.includes(tag)}
							onCheckedChange={() => toggleTag(tag)}
						/>
						<Text>{tag.charAt(0).toUpperCase() + tag.slice(1)}</Text>
					</label>
				))}
			</div>

			<Button
				onClick={submitInvalidate}
				isLoading={loading}
				disabled={selected.length === 0}
			>
				Invalidate Selected Tags
			</Button>

			{statusMsg && <Text>{statusMsg}</Text>}
		</Container>
	)
}

// Config for admin sidebar
export const config = defineRouteConfig({
	label: "Invalidate Cache",
})

export default InvalidateCachePage
