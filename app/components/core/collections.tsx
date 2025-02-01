import { Input } from "~/components/ui/input";
import { Button } from "../ui/button"
import { Form, Link } from "@remix-run/react"
import { Collection } from "@prisma/client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "~/components/ui/navigation-menu";

export default function Collections({
  userId,
  username,
  collections,
  currentCollection
}: {
  userId: string;
  username: string;
  collections: Collection[];
  currentCollection: Collection;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{currentCollection?.name}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[24rem]">
        <NavigationMenu className="mb-4">
          <NavigationMenuList>
            {collections.map((collection) => {
              const to = `/${username}?collectionId=${collection.id}${userId ? `&secret=${userId}` : ''}`;
              return (
                <NavigationMenuItem key={collection.id} className="block">
                  <Link to={to}>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {collection.name} →
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
        <Form method="post" className="flex flex-row gap-2">
          <input type="hidden" name="intent" value="create-collection" />
          <input type="hidden" name="userId" value={userId} />
          <Input type="text" name="name" placeholder="New collection name" autoFocus />
          <Button type="submit">Create</Button>
        </Form>
      </PopoverContent>
    </Popover>
  )
}