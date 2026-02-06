import {defineRouteConfig} from '@medusajs/admin-sdk';
import {Button, Checkbox, Container, Heading, Text} from '@medusajs/ui';
import {useState} from 'react';

const tagsList = ['products', 'collections', 'categories', 'regions', 'medusa', 'contentful'];

const InvalidateCachePage = () => {
	const [selected, setSelected] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [statusMsg, setStatusMsg] = useState('');

	const toggleTag = (tag: string) => {
		setSelected((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
		);
	};

	const toggleAll = () => {
		setSelected((prev) => prev.length === tagsList.length ? [] : [...tagsList]);
	};

	const submitInvalidate = async () => {
		setLoading(true);
		setStatusMsg('');

		try {
			if (selected.length === 0) {
				throw new Error('Please select at least one tag');
			}

			const body =
				selected.length === tagsList.length ? {all: true} : {tags: selected};

			const res = await fetch('/admin/clear-cache', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({}));
				throw new Error(`HTTP ${res.status} - ${errorData.error || res.statusText}`);
			}

			const data = await res.json();
			setStatusMsg(
				data.message || `Cache invalidated successfully for ${selected.length} tag(s)!`
			);
		} catch (err) {
			console.error(err);
			setStatusMsg(err instanceof Error ? err.message : 'Error during cache invalidation.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container className="p-6 space-y-6">
			<Heading level="h2">Invalidate Cache</Heading>
			<Text>Select which cache tags to clear:</Text>

			<div className="flex flex-col gap-3">
				<label className="flex items-center gap-2 cursor-pointer border-b pb-2 mb-1">
					<Checkbox
						checked={selected.length === tagsList.length}
						onCheckedChange={toggleAll}
					/>
					<Text className="font-medium">Select All</Text>
				</label>
				{tagsList.map((tag) => (
					<label key={tag} className="flex items-center gap-2 cursor-pointer">
						<Checkbox
							checked={selected.includes(tag)}
							onCheckedChange={() => toggleTag(tag)}
						/>
						<Text>{tag.charAt(0).toUpperCase() + tag.slice(1)}</Text>
					</label>
				))}
			</div>

			<Button onClick={submitInvalidate} isLoading={loading} disabled={selected.length === 0}>
				Invalidate Selected Tags
			</Button>

			{statusMsg && <Text>{statusMsg}</Text>}
		</Container>
	);
};

export const config = defineRouteConfig({
	label: 'Invalidate Cache'
});

export default InvalidateCachePage;
