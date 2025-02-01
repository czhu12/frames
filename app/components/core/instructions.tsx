import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useState } from "react";

export default function Instructions({username, userId}: {username: string, userId: string}) {
  const [publicCopied, setPublicCopied] = useState(false);
  const [adminCopied, setAdminCopied] = useState(false);

  const handleCopy = async (text: string, isAdmin: boolean) => {
    await navigator.clipboard.writeText(text);
    if (isAdmin) {
      setAdminCopied(true);
      setTimeout(() => setAdminCopied(false), 2000);
    } else {
      setPublicCopied(true);
      setTimeout(() => setPublicCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">🎉 Success!</h2>
        <p className="text-gray-500">Here are your important links - make sure to save them.</p>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Public URL</Label>
        <div className="flex items-center gap-2">
          <Input 
            readOnly 
            value={`https://reframe.canine.sh/${username}`}
            className="font-mono text-sm bg-gray-50"
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleCopy(`https://reframe.canine.sh/${username}`, false)}
          >
            {publicCopied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="text-sm text-gray-500">You can share this link with anyone!</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Admin URL</Label>
        <div className="flex items-center gap-2">
          <Input 
            readOnly 
            value={`https://reframe.canine.sh/${username}?secret=${userId}`}
            className="font-mono text-sm bg-gray-50"
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleCopy(`https://reframe.canine.sh/${username}?secret=${userId}`, true)}
          >
            {adminCopied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="text-sm text-gray-500"><b>Important: Copy and save this admin link now</b> - you won't be able to see it again! It allows editing your frames.</p>
      </div>
    </div>
  );
}