import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Pais } from '../../interfaces/pais';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private apiUrl = 'https://api.restcountries.com/countries/v5';
  private apiKey = 'rc_live_946b0bae59dd43349ce093633e9bdd92';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`
    });
  }

  


  private transformar(objects: any[]): Pais[] {
  return objects.map((pais: any) => ({
    nombre: pais.names?.translations?.spa?.common || 
            pais.names?.native?.spa?.common || 
            pais.names?.common || 'Sin nombre',
    bandera: pais.flag?.url_png || '',
    capital: pais.capitals?.[0]?.name || 'Sin capital',
    poblacion: pais.population || 0,
    region: pais.region || 'Sin región',
    latitud: pais.capitals?.[0]?.coordinates?.lat || 0,
    longitud: pais.capitals?.[0]?.coordinates?.lng || 0
  }));
}

  obtenerTodos(): Observable<Pais[]> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      switchMap(data => {
        console.log('RESPUESTA COMPLETA:', data); 
        const total = data.data.meta.total;
const limit = data.data.meta.limit;
        const paginas = Math.ceil(total / limit);

        const peticiones: Observable<any>[] = [];
        for (let i = 0; i < paginas; i++) {
          const offset = i * limit;
          peticiones.push(
            this.http.get<any>(`${this.apiUrl}?limit=${limit}&offset=${offset}`, { headers: this.getHeaders() })
          );
        }

        return forkJoin(peticiones).pipe(
          map(resultados => {
            const todos: any[] = [];
            resultados.forEach(r => {
              if (r?.data?.objects) {
                todos.push(...r.data.objects);
              }
            });
            return this.transformar(todos);
          })
        );
      })
    );
  }
}