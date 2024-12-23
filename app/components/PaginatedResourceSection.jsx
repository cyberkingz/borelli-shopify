import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 * @param {Class<Pagination<NodesType>>['connection']>}
 */
export function PaginatedResourceSection({
  connection,
  children,
  resourcesClassName,
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div className="flex flex-col items-center">
            <div className="w-full mb-8">
              {resourcesClassName ? (
                <div className={resourcesClassName}>{resourcesMarkup}</div>
              ) : (
                resourcesMarkup
              )}
            </div>
            
            <div className="pb-12">
              <NextLink className="inline-block">
                {isLoading ? (
                  <span className="inline-flex items-center px-12 py-4 bg-gray-200 text-gray-500 rounded cursor-wait">
                    Loading...
                  </span>
                ) : (
                  <span className="inline-flex items-center px-12 py-4 bg-black text-white rounded hover:bg-gray-800 transition-colors">
                    Load More
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                )}
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}
