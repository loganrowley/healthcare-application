/**
 * Used to query the databases of genes.
 */

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';

import { FilterableSearchService } from './filterable-search/filterable-search.component';
import { Gene } from '../global/genomic-data';
import { SearchableGeneDatabase } from './providers/database-services.interface';
import { MyGeneInfoSearchService } from './providers/mygeneinfo-search.service';

@Injectable()
export class RobustGeneSearchService implements FilterableSearchService {

  constructor(private mygeneinfoSearchService: MyGeneInfoSearchService) {}

  geneSearchServices: SearchableGeneDatabase[] = [this.mygeneinfoSearchService];

  public search = (term: string): Observable<Gene[]> => {
    // map them into a array of observables and forkJoin
    return Observable.forkJoin(this.geneSearchServices
        .map(searchService => searchService.searchGenes(term))
      ).map((geneArrays: Gene[][]) => {
        const massiveGeneArray: Gene[] = [];

        const addGene = (gene: Gene) => {
          for (let arrayIndex = 0; arrayIndex < massiveGeneArray.length; arrayIndex++) {
            // Make sure that we are sorting alphabetically.
            if (massiveGeneArray[arrayIndex].optionName() === gene.optionName()) {
              massiveGeneArray[arrayIndex].mergeWith(gene);
              console.log('Merged ' + gene.optionName());
              return;
            } else if (massiveGeneArray[arrayIndex].optionName() > gene.optionName()) {
              massiveGeneArray.splice(arrayIndex, 0, gene);
              return;
            }
          }

          // It must've not been pushed if we reach here.
          massiveGeneArray.push(gene);
        }

        // Variant merging/placing loop.
        for (const geneArray of geneArrays) {
          for (const gene of geneArray) {
            addGene(gene);
          }
        }
        return massiveGeneArray;
      }
    );
  }
}

