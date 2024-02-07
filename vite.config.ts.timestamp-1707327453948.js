// vite.config.ts
import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import sveltePreprocess from "svelte-preprocess";
import zipPack from "vite-plugin-zip-pack";

// src/manifest.ts
import { defineManifest } from "@crxjs/vite-plugin";
var manifest_default = defineManifest({
  name: "MbnEasyLogin",
  description: "An extension to easily login to Mbn",
  version: "1.0.0",
  manifest_version: 3,
  icons: {
    "128": "img/logo-128.png",
    "48": "img/logo-48.png",
    "512": "img/logo-512.png"
  },
  action: {
    default_popup: "popup.html",
    default_icon: "img/logo-48.png"
  },
  options_page: "options.html",
  background: {
    service_worker: "src/background/index.ts",
    type: "module"
  },
  content_scripts: [
    {
      matches: [
        "https://cas.monbureaunumerique.fr/login*",
        "https://educonnect.education.gouv.fr/idp/profile/SAML2/POST/SSO?execution=*",
        "https://www.monbureaunumerique.fr/sg.do?*"
      ],
      js: ["src/content/index.ts"]
    }
  ],
  web_accessible_resources: [
    {
      resources: ["img/logo-48.png", "img/logo-128.png", "img/logo-512.png"],
      matches: []
    }
  ],
  permissions: ["tabs", "activeTab", "storage"],
  host_permissions: [
    "https://cas.monbureaunumerique.fr/login?service=https%3A%2F%2Fwww.monbureaunumerique.fr%2Fsg.do%3FPROC%3DIDENTIFICATION_FRONT",
    "https://educonnect.education.gouv.fr/idp/profile/SAML2/POST/SSO?execution=*",
    "https://www.monbureaunumerique.fr/sg.do?*"
  ]
});

// vite.config.ts
var vite_config_default = defineConfig(({ mode }) => {
  const production = mode === "production";
  return {
    build: {
      emptyOutDir: true,
      outDir: "build",
      rollupOptions: {
        output: {
          chunkFileNames: "assets/chunk-[hash].js"
        }
      }
    },
    plugins: [
      crx({ manifest: manifest_default }),
      svelte({
        compilerOptions: {
          dev: !production
        },
        preprocess: sveltePreprocess()
      }),
      zipPack({
        outDir: `package`,
        inDir: "build",
        outFileName: `${manifest_default.short_name ?? manifest_default.name.replaceAll(" ", "-")}-extension-v${manifest_default.version}.zip`
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve("/Users/Yanis/Documents/Programming/MbnConnexionExtension", "src")
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21hbmlmZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgY3J4IH0gZnJvbSAnQGNyeGpzL3ZpdGUtcGx1Z2luJ1xuaW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSAnQHN2ZWx0ZWpzL3ZpdGUtcGx1Z2luLXN2ZWx0ZSdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgc3ZlbHRlUHJlcHJvY2VzcyBmcm9tICdzdmVsdGUtcHJlcHJvY2VzcydcbmltcG9ydCB6aXBQYWNrIGZyb20gJ3ZpdGUtcGx1Z2luLXppcC1wYWNrJztcbmltcG9ydCBtYW5pZmVzdCBmcm9tICcuL3NyYy9tYW5pZmVzdCdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBwcm9kdWN0aW9uID0gbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nXG5cbiAgcmV0dXJuIHtcbiAgICBidWlsZDoge1xuICAgICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgICBvdXREaXI6ICdidWlsZCcsXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiAnYXNzZXRzL2NodW5rLVtoYXNoXS5qcycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgY3J4KHsgbWFuaWZlc3QgfSksXG4gICAgICBzdmVsdGUoe1xuICAgICAgICBjb21waWxlck9wdGlvbnM6IHtcbiAgICAgICAgICBkZXY6ICFwcm9kdWN0aW9uLFxuICAgICAgICB9LFxuICAgICAgICBwcmVwcm9jZXNzOiBzdmVsdGVQcmVwcm9jZXNzKCksXG4gICAgICB9KSxcbiAgICAgIHppcFBhY2soe1xuICAgICAgICBvdXREaXI6IGBwYWNrYWdlYCxcbiAgICAgICAgaW5EaXI6ICdidWlsZCcsXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgb3V0RmlsZU5hbWU6IGAke21hbmlmZXN0LnNob3J0X25hbWUgPz8gbWFuaWZlc3QubmFtZS5yZXBsYWNlQWxsKFwiIFwiLCBcIi1cIil9LWV4dGVuc2lvbi12JHttYW5pZmVzdC52ZXJzaW9ufS56aXBgLFxuICAgICAgfSksXG4gICAgXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShcIi9Vc2Vycy9ZYW5pcy9Eb2N1bWVudHMvUHJvZ3JhbW1pbmcvTWJuQ29ubmV4aW9uRXh0ZW5zaW9uXCIsICdzcmMnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfVxufSlcbiIsICJpbXBvcnQgeyBkZWZpbmVNYW5pZmVzdCB9IGZyb20gJ0Bjcnhqcy92aXRlLXBsdWdpbidcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lTWFuaWZlc3Qoe1xuICBuYW1lOiAnTWJuRWFzeUxvZ2luJyxcbiAgZGVzY3JpcHRpb246ICdBbiBleHRlbnNpb24gdG8gZWFzaWx5IGxvZ2luIHRvIE1ibicsXG4gIHZlcnNpb246ICcxLjAuMCcsXG4gIG1hbmlmZXN0X3ZlcnNpb246IDMsXG4gIGljb25zOiB7XG4gICAgJzEyOCc6ICdpbWcvbG9nby0xMjgucG5nJyxcbiAgICAnNDgnOiAnaW1nL2xvZ28tNDgucG5nJyxcbiAgICAnNTEyJzogJ2ltZy9sb2dvLTUxMi5wbmcnLFxuICB9LFxuICBhY3Rpb246IHtcbiAgICBkZWZhdWx0X3BvcHVwOiAncG9wdXAuaHRtbCcsXG4gICAgZGVmYXVsdF9pY29uOiAnaW1nL2xvZ28tNDgucG5nJyxcbiAgfSxcbiAgb3B0aW9uc19wYWdlOiAnb3B0aW9ucy5odG1sJyxcbiAgYmFja2dyb3VuZDoge1xuICAgIHNlcnZpY2Vfd29ya2VyOiAnc3JjL2JhY2tncm91bmQvaW5kZXgudHMnLFxuICAgIHR5cGU6ICdtb2R1bGUnLFxuICB9LFxuICBjb250ZW50X3NjcmlwdHM6IFtcbiAgICB7XG4gICAgICBtYXRjaGVzOiBbXG4gICAgICAgICdodHRwczovL2Nhcy5tb25idXJlYXVudW1lcmlxdWUuZnIvbG9naW4qJyxcbiAgICAgICAgJ2h0dHBzOi8vZWR1Y29ubmVjdC5lZHVjYXRpb24uZ291di5mci9pZHAvcHJvZmlsZS9TQU1MMi9QT1NUL1NTTz9leGVjdXRpb249KicsXG4gICAgICAgICdodHRwczovL3d3dy5tb25idXJlYXVudW1lcmlxdWUuZnIvc2cuZG8/KicsXG4gICAgICBdLFxuICAgICAganM6IFsnc3JjL2NvbnRlbnQvaW5kZXgudHMnXSxcbiAgICB9LFxuICBdLFxuICB3ZWJfYWNjZXNzaWJsZV9yZXNvdXJjZXM6IFtcbiAgICB7XG4gICAgICByZXNvdXJjZXM6IFsnaW1nL2xvZ28tNDgucG5nJywgJ2ltZy9sb2dvLTEyOC5wbmcnLCAnaW1nL2xvZ28tNTEyLnBuZyddLFxuICAgICAgbWF0Y2hlczogW10sXG4gICAgfSxcbiAgXSxcbiAgcGVybWlzc2lvbnM6IFsndGFicycsICdhY3RpdmVUYWInLCAnc3RvcmFnZSddLFxuICBob3N0X3Blcm1pc3Npb25zOiBbXG4gICAgJ2h0dHBzOi8vY2FzLm1vbmJ1cmVhdW51bWVyaXF1ZS5mci9sb2dpbj9zZXJ2aWNlPWh0dHBzJTNBJTJGJTJGd3d3Lm1vbmJ1cmVhdW51bWVyaXF1ZS5mciUyRnNnLmRvJTNGUFJPQyUzRElERU5USUZJQ0FUSU9OX0ZST05UJyxcbiAgICAnaHR0cHM6Ly9lZHVjb25uZWN0LmVkdWNhdGlvbi5nb3V2LmZyL2lkcC9wcm9maWxlL1NBTUwyL1BPU1QvU1NPP2V4ZWN1dGlvbj0qJyxcbiAgICAnaHR0cHM6Ly93d3cubW9uYnVyZWF1bnVtZXJpcXVlLmZyL3NnLmRvPyonLFxuICBdLFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBQSxTQUFTLG9CQUFvQjtBQUM3QixTQUFTLFdBQVc7QUFDcEIsU0FBUyxjQUFjO0FBQ3ZCLE9BQU8sVUFBVTtBQUNqQixPQUFPLHNCQUFzQjtBQUM3QixPQUFPLGFBQWE7OztBQ0xwQixTQUFTLHNCQUFzQjtBQUUvQixJQUFPLG1CQUFRLGVBQWU7QUFBQSxFQUM1QixNQUFNO0FBQUEsRUFDTixhQUFhO0FBQUEsRUFDYixTQUFTO0FBQUEsRUFDVCxrQkFBa0I7QUFBQSxFQUNsQixPQUFPO0FBQUEsSUFDTCxPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsRUFDVDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sZUFBZTtBQUFBLElBQ2YsY0FBYztBQUFBLEVBQ2hCO0FBQUEsRUFDQSxjQUFjO0FBQUEsRUFDZCxZQUFZO0FBQUEsSUFDVixnQkFBZ0I7QUFBQSxJQUNoQixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsaUJBQWlCO0FBQUEsSUFDZjtBQUFBLE1BQ0UsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLElBQUksQ0FBQyxzQkFBc0I7QUFBQSxJQUM3QjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLDBCQUEwQjtBQUFBLElBQ3hCO0FBQUEsTUFDRSxXQUFXLENBQUMsbUJBQW1CLG9CQUFvQixrQkFBa0I7QUFBQSxNQUNyRSxTQUFTLENBQUM7QUFBQSxJQUNaO0FBQUEsRUFDRjtBQUFBLEVBQ0EsYUFBYSxDQUFDLFFBQVEsYUFBYSxTQUFTO0FBQUEsRUFDNUMsa0JBQWtCO0FBQUEsSUFDaEI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFDRixDQUFDOzs7QURuQ0QsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxhQUFhLFNBQVM7QUFFNUIsU0FBTztBQUFBLElBQ0wsT0FBTztBQUFBLE1BQ0wsYUFBYTtBQUFBLE1BQ2IsUUFBUTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFVBQ04sZ0JBQWdCO0FBQUEsUUFDbEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsSUFBSSxFQUFFLDJCQUFTLENBQUM7QUFBQSxNQUNoQixPQUFPO0FBQUEsUUFDTCxpQkFBaUI7QUFBQSxVQUNmLEtBQUssQ0FBQztBQUFBLFFBQ1I7QUFBQSxRQUNBLFlBQVksaUJBQWlCO0FBQUEsTUFDL0IsQ0FBQztBQUFBLE1BQ0QsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsT0FBTztBQUFBLFFBRVAsYUFBYSxHQUFHLGlCQUFTLGNBQWMsaUJBQVMsS0FBSyxXQUFXLEtBQUssR0FBRyxnQkFBZ0IsaUJBQVM7QUFBQSxNQUNuRyxDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsNERBQTRELEtBQUs7QUFBQSxNQUNyRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
