import React from 'react';
import { Entity } from 'svitore';

type SvitoreContextValue = Map<Entity<any>, Entity<any>> | null

const SvitoreContext = React.createContext<SvitoreContextValue>(null)

const useSvitoreContext = (): SvitoreContextValue => React.useContext(SvitoreContext)

export { useSvitoreContext, SvitoreContext }
export type { SvitoreContextValue }
