import { DocumentNode } from 'graphql'; // eslint-disable-line import/no-extraneous-dependencies

import { JsonObject, JsonValue, PathPart } from './primitive';
import { NodeId, RawOperation } from './schema';

export namespace Queryable {
  export interface FieldInstanceIterator {
    (value: any, args?: JsonObject): void;
  }
}

/**
 * Represents a queryable portion of our cache (the cache itself, transactions,
 * views, etc).
 */
export interface Queryable {

  /**
   * Performs any transformations of operation documents.
   *
   * Cache consumers should call this on any operation document prior to calling
   * any other method in the cache.
   */
  transformDocument(document: DocumentNode): DocumentNode;

  /**
   * Reads the selection expressed by a query from the cache.
   *
   * TODO: Can we drop non-optimistic reads?
   * https://github.com/apollographql/apollo-client/issues/1971#issuecomment-319402170
   */
  read(query: RawOperation, optimistic?: boolean): { result?: JsonValue, complete: boolean };

  /**
   * Writes values for a selection to the cache.
   */
  write(query: RawOperation, payload: JsonObject): void;

  /**
   * Removes values for a selection to the cache
   */
  evict(query: RawOperation): { success: boolean };

  /**
   *
   */
  forEachFieldInstance(nodeId: NodeId, path: PathPart[], iterator: Queryable.FieldInstanceIterator): void;

}
