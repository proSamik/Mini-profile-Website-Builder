import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { EditorClient } from './editor-client';

export default async function EditorPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  return <EditorClient userId={session.user.id} />;
}
