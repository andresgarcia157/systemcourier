// Utility function to generate sequential IDs
export async function generateSequentialId(
  getCurrentId: () => Promise<string | null>,
  startFrom = 100000,
): Promise<string> {
  const currentId = await getCurrentId()
  if (!currentId) {
    return startFrom.toString()
  }
  return (Number.parseInt(currentId) + 1).toString()
}

// Example usage with database:
// const newId = await generateSequentialId(async () => {
//   const lastUser = await db.user.findFirst({ orderBy: { id: 'desc' } })
//   return lastUser?.id || null
// })

