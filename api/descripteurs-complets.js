// DESCRIPTEURS COMPLETS PEI - Toutes matières, toutes années, tous critères
// Basé sur les guides officiels IB PEI

export const DESCRIPTEURS_COMPLETS = {
  // ============================================================================
  // DESIGN - PEI 1, 2, 3, 4, 5
  // ============================================================================
  design: {
    pei1: {
      A: {
        titre: "Recherche et analyse",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. indique le besoin d'apporter une solution à un problème ; ii. indique les conclusions des recherches qu'il a menées.",
          "3-4": "L'élève : i. résume le besoin d'apporter une solution à un problème ; ii. indique, avec de l'aide, quelques étapes des recherches nécessaires au développement d'une solution ; iii. indique les caractéristiques principales d'un produit existant servant d'inspiration pour trouver une solution au problème ; iv. résume quelques-unes des principales conclusions des recherches qu'il a menées.",
          "5-6": "L'élève : i. explique le besoin d'apporter une solution à un problème ; ii. indique et hiérarchise, avec de l'aide, les grandes étapes des recherches nécessaires au développement d'une solution au problème ; iii. résume les caractéristiques principales d'un produit existant servant d'inspiration pour trouver une solution au problème ; iv. résume les principales conclusions des recherches pertinentes qu'il a menées.",
          "7-8": "L'élève : i. explique et justifie le besoin d'apporter une solution à un problème ; ii. indique et hiérarchise, avec peu d'aide, les grandes étapes des recherches nécessaires au développement d'une solution au problème ; iii. décrit les caractéristiques principales d'un produit existant servant d'inspiration pour trouver une solution au problème ; iv. présente les principales conclusions des recherches pertinentes qu'il a menées."
        }
      },
      B: {
        titre: "Développement des idées",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. indique un critère de réussite élémentaire établi pour une solution ; ii. présente une idée de conception pouvant être interprétée par d'autres personnes ; iii. crée un dessin ou un schéma de planification incomplet.",
          "3-4": "L'élève : i. indique quelques critères de réussite établis pour la solution ; ii. présente plusieurs idées de conception, à l'aide d'un ou de plusieurs supports appropriés, ou énonce des caractéristiques importantes desdites idées, qui peuvent être interprétées par d'autres personnes ; iii. indique les caractéristiques principales de la conception retenue ; iv. crée un dessin ou un schéma de planification ou énumère les modalités requises pour la création de la solution retenue.",
          "5-6": "L'élève : i. développe quelques critères de réussite établis pour la solution ; ii. présente quelques idées de conception réalisables, à l'aide d'un ou de plusieurs supports appropriés, et énonce des caractéristiques importantes desdites idées, qui peuvent être interprétées par d'autres personnes ; iii. présente la conception retenue en indiquant ses caractéristiques principales ; iv. crée un dessin ou un schéma de planification et énumère les informations principales pour la création de la solution retenue.",
          "7-8": "L'élève : i. développe une liste des critères de réussite établis pour la solution ; ii. présente des idées de conception réalisables, à l'aide d'un ou de plusieurs supports appropriés, et résume les caractéristiques importantes desdites idées, qui peuvent être correctement interprétées par d'autres personnes ; iii. présente la conception retenue en décrivant ses caractéristiques principales ; iv. crée un dessin ou un schéma de planification qui résume les informations principales utiles à la réalisation de la solution retenue."
        }
      },
      C: {
        titre: "Création de la solution",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. démontre des compétences techniques de base lors de la réalisation de la solution ; ii. crée la solution, qui fonctionne mal et qui est présentée de manière incomplète.",
          "3-4": "L'élève : i. énumère les étapes principales d'un plan qui contient quelques détails, et que les autres élèves ont du mal à suivre pour créer la solution ; ii. démontre des compétences techniques satisfaisantes lors de la réalisation de la solution ; iii. crée la solution, qui fonctionne en partie et qui est présentée de manière convenable ; iv. indique un changement apporté à la conception retenue ou au plan lors de la réalisation de la solution.",
          "5-6": "L'élève : i. énumère les étapes d'un plan qui tient compte du temps et des ressources et que les autres élèves peuvent suivre pour créer la solution ; ii. démontre de bonnes compétences techniques lors de la réalisation de la solution ; iii. crée la solution, qui fonctionne comme prévu et qui est présentée de manière appropriée ; iv. indique un changement apporté à la conception retenue et au plan lors de la réalisation de la solution.",
          "7-8": "L'élève : i. résume un plan tenant compte de l'utilisation du temps et des ressources, qui donne suffisamment d'informations aux autres élèves pour qu'ils puissent suivre ce plan et créer la solution ; ii. démontre des compétences techniques excellentes lors de la réalisation de la solution ; iii. suit le plan afin de créer la solution, qui fonctionne comme prévu et qui est présentée de manière appropriée ; iv. énumère les changements apportés à la conception retenue et au plan lors de la réalisation de la solution."
        }
      },
      D: {
        titre: "Évaluation",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. définit une méthode d'essai qui est utilisée pour mesurer l'efficacité de la solution ; ii. indique dans quelle mesure la solution est une réussite.",
          "3-4": "L'élève : i. définit une méthode d'essai pertinente qui génère des données afin de mesurer l'efficacité de la solution ; ii. indique dans quelle mesure la solution est une réussite par rapport au cahier des charges, en s'appuyant sur les résultats d'un test pertinent ; iii. indique une manière dont la solution pourrait être améliorée ; iv. indique un effet possible de la solution sur le client ou le public cible.",
          "5-6": "L'élève : i. définit des méthodes d'essai pertinentes qui génèrent des données afin de mesurer l'efficacité de la solution ; ii. indique dans quelle mesure la solution est une réussite par rapport au cahier des charges, en s'appuyant sur des tests de produits pertinents ; iii. résume une manière dont la solution pourrait être améliorée ; iv. résume, avec de l'aide, les effets de la solution sur le client ou le public cible.",
          "7-8": "L'élève : i. résume des méthodes d'essai simples et pertinentes qui génèrent des données afin de mesurer l'efficacité de la solution ; ii. résume dans quelle mesure la solution est une réussite par rapport au cahier des charges, en s'appuyant sur des tests de produits authentiques ; iii. résume en quoi la solution pourrait être améliorée ; iv. résume les effets de la solution sur le client ou le public cible."
        }
      }
    },
    pei2: "same_as_pei1", // PEI 1-2 use same descriptors
    pei3: {
      A: {
        titre: "Recherche et analyse",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. indique le besoin d'apporter une solution à un problème ; ii. indique quelques-unes des principales conclusions des recherches qu'il a menées.",
          "3-4": "L'élève : i. résume le besoin d'apporter une solution à un problème ; ii. indique, avec de l'aide, les recherches nécessaires au développement d'une solution au problème ; iii. résume un produit existant servant d'inspiration pour trouver une solution au problème ; iv. développe un énoncé de projet élémentaire qui résume quelques-unes des conclusions des recherches pertinentes qu'il a menées.",
          "5-6": "L'élève : i. explique le besoin d'apporter une solution à un problème ; ii. construit, avec de l'aide, un plan de recherche qui indique et hiérarchise les recherches primaires et secondaires nécessaires au développement d'une solution au problème ; iii. décrit un groupe de produits similaires servant d'inspiration pour trouver une solution au problème ; iv. développe un énoncé de projet qui résume les conclusions des recherches pertinentes qu'il a menées.",
          "7-8": "L'élève : i. explique et justifie le besoin d'apporter une solution à un problème ; ii. construit, de manière autonome, un plan de recherche qui indique et hiérarchise les recherches primaires et secondaires nécessaires au développement d'une solution au problème ; iii. analyse un groupe de produits similaires servant d'inspiration pour trouver une solution au problème ; iv. développe un énoncé de projet qui présente l'analyse des recherches pertinentes qu'il a menées."
        }
      },
      B: {
        titre: "Développement des idées",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. énumère quelques critères de réussite élémentaires établis pour la conception d'une solution ; ii. présente une idée de conception pouvant être interprétée par d'autres personnes ; iii. crée des dessins ou des schémas de planification incomplets.",
          "3-4": "L'élève : i. construit une liste des critères de réussite établis pour la conception d'une solution ; ii. présente quelques idées de conception réalisables, à l'aide d'un ou de plusieurs supports appropriés, ou explique des caractéristiques importantes desdites idées, qui peuvent être interprétées par d'autres personnes ; iii. résume les principales raisons du choix de la conception retenue en faisant référence au cahier des charges ; iv. crée des dessins ou des schémas de planification ou énumère les modalités requises pour la solution retenue.",
          "5-6": "L'élève : i. développe un cahier des charges qui identifie les critères de réussite établis pour la conception d'une solution ; ii. présente un éventail d'idées de conception réalisables, à l'aide d'un ou de plusieurs supports appropriés, et explique des caractéristiques importantes desdites idées, qui peuvent être interprétées par d'autres personnes ; iii. présente la conception retenue et résume les principales raisons de son choix en faisant référence au cahier des charges ; iv. développe des dessins ou des schémas de planification précis et énumère les modalités requises pour la création de la solution retenue.",
          "7-8": "L'élève : i. développe un cahier des charges qui résume les critères de réussite établis pour la conception d'une solution en s'appuyant sur les données recueillies ; ii. présente un éventail d'idées de conception réalisables, à l'aide d'un ou de plusieurs supports appropriés et d'annotations, pouvant être correctement interprétées par d'autres personnes ; iii. présente la conception retenue et résume les raisons de son choix en faisant référence au cahier des charges ; iv. développe des dessins ou des schémas de planification précis et résume les modalités requises pour la création de la solution retenue."
        }
      },
      C: {
        titre: "Création de la solution",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. démontre des compétences techniques de base lors de la réalisation de la solution ; ii. crée la solution, qui fonctionne mal et qui est présentée de manière incomplète.",
          "3-4": "L'élève : i. résume chaque étape de la conception dans un plan qui contient quelques détails, et que les autres élèves ont du mal à suivre pour créer la solution ; ii. démontre des compétences techniques satisfaisantes lors de la réalisation de la solution ; iii. crée la solution, qui fonctionne en partie et qui est présentée de manière convenable ; iv. résume les changements apportés à la conception retenue ou au plan lors de la réalisation de la solution.",
          "5-6": "L'élève : i. construit un plan tenant compte du temps et des ressources, qui donne suffisamment d'informations aux autres élèves pour qu'ils puissent suivre ce plan et créer la solution ; ii. démontre de bonnes compétences techniques lors de la réalisation de la solution ; iii. crée la solution, qui fonctionne comme prévu et qui est présentée de manière appropriée ; iv. résume les changements apportés à la conception retenue et au plan lors de la réalisation de la solution.",
          "7-8": "L'élève : i. construit un plan logique résumant une utilisation efficace du temps et des ressources, qui donne suffisamment d'informations aux autres élèves pour qu'ils puissent suivre ce plan et créer la solution ; ii. démontre des compétences techniques excellentes lors de la réalisation de la solution ; iii. suit le plan afin de créer la solution, qui fonctionne comme prévu et qui est présentée de manière appropriée ; iv. explique les changements apportés à la conception retenue et au plan lors de la réalisation de la solution."
        }
      },
      D: {
        titre: "Évaluation",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. décrit une méthode d'essai qui est utilisée pour mesurer l'efficacité de la solution ; ii. indique dans quelle mesure la solution est une réussite.",
          "3-4": "L'élève : i. décrit une méthode d'essai pertinente qui génère des données afin de mesurer l'efficacité de la solution ; ii. résume dans quelle mesure la solution est une réussite par rapport au cahier des charges, en s'appuyant sur des tests des produits pertinents ; iii. énumère les manières dont la solution pourrait être améliorée ; iv. résume les effets de la solution sur le client ou le public cible.",
          "5-6": "L'élève : i. décrit des méthodes d'essai pertinentes qui génèrent des données afin de mesurer l'efficacité de la solution ; ii. décrit dans quelle mesure la solution est une réussite par rapport au cahier des charges, en s'appuyant sur des tests de produits pertinents ; iii. résume en quoi la solution pourrait être améliorée ; iv. décrit, avec de l'aide, les effets de la solution sur le client ou le public cible.",
          "7-8": "L'élève : i. décrit des méthodes d'essai détaillées et pertinentes qui génèrent des données précises afin de mesurer l'efficacité de la solution ; ii. explique dans quelle mesure la solution est une réussite par rapport au cahier des charges, en s'appuyant sur des tests de produits authentiques ; iii. décrit en quoi la solution pourrait être améliorée ; iv. décrit les effets de la solution sur le client ou le public cible."
        }
      }
    },
    pei4: "same_as_pei3", // PEI 3-4 use same descriptors
    pei5: {
      A: {
        titre: "Recherche et analyse",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. indique le besoin d'apporter une solution à un problème pour un client ou un public cible spécifique ; ii. développe un énoncé de projet élémentaire qui indique les conclusions des recherches pertinentes qu'il a menées.",
          "3-4": "L'élève : i. résume le besoin d'apporter une solution à un problème pour un client ou un public cible spécifique ; ii. résume, avec de l'aide, un plan de recherche qui identifie les recherches primaires et secondaires nécessaires au développement d'une solution au problème ; iii. analyse un produit existant servant d'inspiration pour trouver une solution au problème ; iv. développe un énoncé de projet qui résume l'analyse des recherches pertinentes qu'il a menées.",
          "5-6": "L'élève : i. explique le besoin d'apporter une solution à un problème pour un client ou un public cible spécifique ; ii. construit, avec de l'aide, un plan de recherche qui identifie et hiérarchise les recherches primaires et secondaires nécessaires au développement d'une solution au problème ; iii. analyse une gamme de produits existants servant d'inspiration pour trouver une solution au problème ; iv. développe un énoncé de projet qui explique l'analyse des recherches pertinentes qu'il a menées.",
          "7-8": "L'élève : i. explique et justifie le besoin d'apporter une solution à un problème pour un client ou un public cible ; ii. construit, de manière autonome, un plan de recherche détaillé qui identifie et hiérarchise les recherches primaires et secondaires nécessaires au développement d'une solution au problème ; iii. analyse en détail une gamme de produits existants servant d'inspiration pour trouver une solution au problème ; iv. développe un énoncé de projet détaillé qui récapitule l'analyse des recherches pertinentes qu'il a menées."
        }
      },
      B: {
        titre: "Développement des idées",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. énumère quelques aspects élémentaires pour la conception d'une solution dans un cahier des charges ; ii. présente une conception pouvant être interprétée par d'autres personnes ; iii. crée des dessins ou des schémas de planification incomplets.",
          "3-4": "L'élève : i. énumère quelques aspects liés aux critères de réussite établis pour la conception d'une solution dans un cahier des charges ; ii. présente quelques conceptions réalisables, à l'aide d'un ou de plusieurs supports appropriés ou d'annotations, pouvant être interprétées par d'autres personnes ; iii. justifie le choix de la conception retenue en faisant référence au cahier des charges ; iv. crée des dessins ou des schémas de planification ou énumère les modalités requises pour la création de la solution retenue.",
          "5-6": "L'élève : i. développe un cahier des charges qui résume les critères de réussite établis pour la conception d'une solution ; ii. développe un éventail d'idées de conception réalisables, à l'aide d'un ou de plusieurs supports appropriés et d'annotations, pouvant être interprétées par d'autres personnes ; iii. présente la conception retenue et justifie son choix en faisant référence au cahier des charges ; iv. développe des dessins ou des schémas de planification précis et énumère les modalités requises pour la création de la solution retenue.",
          "7-8": "L'élève : i. développe un cahier des charges détaillé qui explique les critères de réussite établis pour la conception d'une solution en fonction de l'analyse des recherches ; ii. développe un éventail d'idées de conception réalisables, à l'aide d'un ou de plusieurs supports appropriés et d'annotations détaillées, pouvant être correctement interprétées par d'autres personnes ; iii. présente la conception retenue et justifie pleinement son choix de manière critique en faisant référence au cahier des charges de façon détaillée ; iv. développe des dessins ou des schémas de planification précis et détaillés et résume les modalités requises pour la création de la solution retenue."
        }
      },
      C: {
        titre: "Création de la solution",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. démontre des compétences techniques de base lors de la réalisation de la solution ; ii. crée la solution, qui fonctionne mal et qui est présentée de manière incomplète.",
          "3-4": "L'élève : i. construit un plan qui contient quelques détails de production et que les autres élèves ont du mal à suivre ; ii. démontre des compétences techniques satisfaisantes lors de la réalisation de la solution ; iii. crée la solution, qui fonctionne en partie et qui est présentée de manière convenable ; iv. résume les changements apportés à la conception retenue et au plan lors de la réalisation de la solution.",
          "5-6": "L'élève : i. construit un plan logique tenant compte du temps et des ressources, qui donne suffisamment d'informations aux autres élèves pour qu'ils puissent suivre ce plan et créer la solution ; ii. démontre de bonnes compétences techniques lors de la réalisation de la solution ; iii. crée la solution, qui fonctionne comme prévu et qui est présentée de manière appropriée ; iv. décrit les changements apportés à la conception retenue et au plan lors de la réalisation de la solution.",
          "7-8": "L'élève : i. construit un plan détaillé et logique décrivant une utilisation efficace du temps et des ressources, qui donne suffisamment d'informations aux autres élèves pour qu'ils puissent suivre ce plan et créer la solution ; ii. démontre des compétences techniques excellentes lors de la réalisation de la solution ; iii. suit le plan afin de créer la solution, qui fonctionne comme prévu et qui est présentée de manière appropriée ; iv. justifie pleinement les changements apportés à la conception retenue et au plan lors de la réalisation de la solution."
        }
      },
      D: {
        titre: "Évaluation",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. élabore une méthode d'essai qui est utilisée pour mesurer l'efficacité de la solution ; ii. indique dans quelle mesure la solution est une réussite.",
          "3-4": "L'élève : i. élabore une méthode d'essai pertinente qui génère des données afin de mesurer l'efficacité de la solution ; ii. résume dans quelle mesure la solution est une réussite par rapport au cahier des charges, en s'appuyant sur des tests de produits pertinents ; iii. résume en quoi la solution pourrait être améliorée ; iv. résume les effets de la solution sur le client ou le public cible.",
          "5-6": "L'élève : i. élabore des méthodes d'essai pertinentes qui génèrent des données afin de mesurer l'efficacité de la solution ; ii. explique dans quelle mesure la solution est une réussite par rapport au cahier des charges, en s'appuyant sur des tests de produits pertinents ; iii. décrit en quoi la solution pourrait être améliorée ; iv. explique, avec de l'aide, les effets de la solution sur le client ou le public cible.",
          "7-8": "L'élève : i. élabore des méthodes détaillées et pertinentes qui génèrent des données afin de mesurer l'efficacité de la solution ; ii. évalue de manière critique dans quelle mesure la solution est une réussite par rapport au cahier des charges, en s'appuyant sur des tests de produits authentiques ; iii. explique en quoi la solution pourrait être améliorée ; iv. explique les effets du produit sur le client ou le public cible."
        }
      }
    }
  },

  // ============================================================================
  // SCIENCES - PEI 1, 2, 3, 4, 5
  // ============================================================================
  sciences: {
    pei1: {
      A: {
        titre: "Connaissances et compréhension",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. indique des connaissances scientifiques ; ii. applique des connaissances scientifiques pour résoudre des problèmes présentés dans des situations familières ; iii. applique, avec de l'aide, de l'information pour formuler une explication scientifiquement valable.",
          "3-4": "L'élève : i. résume des connaissances scientifiques ; ii. applique des connaissances scientifiques pour résoudre des problèmes présentés dans des situations familières et suggère des solutions aux problèmes présentés dans des situations non familières ; iii. applique de l'information pour formuler une explication scientifiquement valable.",
          "5-6": "L'élève : i. décrit des connaissances scientifiques ; ii. applique des connaissances scientifiques pour résoudre des problèmes présentés dans des situations familières et non familières ; iii. analyse de l'information pour formuler une explication scientifiquement valable.",
          "7-8": "L'élève : i. explique des connaissances scientifiques ; ii. applique des connaissances scientifiques pour résoudre des problèmes présentés dans des situations familières et non familières ; iii. analyse et évalue de l'information pour formuler une explication scientifiquement valable."
        }
      },
      B: {
        titre: "Recherche et élaboration",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. indique le problème à résoudre ou la question à explorer ; ii. indique une hypothèse vérifiable ; iii. indique, avec de l'aide, comment manipuler les variables et décrit la manière de recueillir les données pertinentes ; iv. élabore une méthode, avec de l'aide.",
          "3-4": "L'élève : i. résume le problème ou la question qui sera étudié ; ii. formule une hypothèse vérifiable et l'explique à l'aide d'un raisonnement scientifique ; iii. décrit comment manipuler les variables et décrit la manière de recueillir les données pertinentes ; iv. élabore une méthode complète qui indique le matériel et les instruments requis.",
          "5-6": "L'élève : i. décrit le problème ou la question qui sera étudié et indique les variables pertinentes ; ii. formule une hypothèse vérifiable et l'explique à l'aide d'un raisonnement scientifique ; iii. explique comment manipuler les variables et décrit la manière de recueillir suffisamment de données pertinentes ; iv. élabore une méthode logique et complète qui indique le matériel et les instruments nécessaires.",
          "7-8": "L'élève : i. décrit le problème ou la question qui sera étudié et indique les variables pertinentes ; ii. formule et explique une hypothèse vérifiable à l'aide d'un raisonnement et d'un raisonnement scientifiques corrects ; iii. explique comment manipuler les variables et décrit la manière de recueillir suffisamment de données pertinentes ; iv. élabore une méthode logique, complète et sûre qui indique le matériel et les instruments nécessaires."
        }
      },
      C: {
        titre: "Traitement et évaluation",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. recueille et présente les données dans des représentations numériques ou visuelles ; ii. interprète des données ; iii. indique la validité des résultats, avec de l'aide.",
          "3-4": "L'élève : i. recueille et organise correctement les données à l'aide de représentations numériques ou visuelles simples ; ii. interprète avec précision les données et décrit les résultats ; iii. décrit la validité des résultats.",
          "5-6": "L'élève : i. organise, transforme et présente correctement les données dans des représentations numériques ou visuelles ; ii. interprète avec précision les données et décrit les résultats à l'aide d'un raisonnement scientifique ; iii. discute la validité des résultats en se basant sur les résultats.",
          "7-8": "L'élève : i. organise, transforme et présente correctement les données sous forme numérique ou visuelle ; ii. interprète avec précision les données et décrit les résultats à l'aide d'un raisonnement scientifique correct ; iii. discute la validité des résultats en s'appuyant sur les résultats et explique les améliorations ou les prolongements possibles de la méthode."
        }
      },
      D: {
        titre: "Réflexion sur les répercussions de la science",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. indique les manières dont la science est appliquée et utilisée pour répondre à un besoin ou résoudre un problème précis ; ii. indique les implications de l'utilisation de la science et son application lors de la résolution d'un problème ou d'un questionnement précis ; iii. applique, avec de l'aide, un raisonnement scientifique de façon efficace pour prendre une décision.",
          "3-4": "L'élève : i. résume les manières dont la science est appliquée et utilisée pour répondre à un besoin ou résoudre un problème précis ; ii. décrit les implications de l'utilisation de la science et de son application lors de la résolution d'un problème ou d'un questionnement précis en interaction avec un des facteurs suivants : la morale, l'éthique, la culture, l'économie, la politique et l'environnement ; iii. applique un raisonnement scientifique de façon efficace pour prendre une décision.",
          "5-6": "L'élève : i. décrit les manières dont la science est appliquée et utilisée pour répondre à un besoin ou résoudre un problème précis ; ii. discute des implications de l'utilisation de la science et de son application lors de la résolution d'un problème ou d'un questionnement précis en interaction avec un des facteurs suivants : la morale, l'éthique, la culture, l'économie, la politique et l'environnement ; iii. applique un raisonnement scientifique de façon efficace pour prendre une décision.",
          "7-8": "L'élève : i. décrit et résume les manières dont la science est appliquée et utilisée pour répondre à un besoin ou résoudre un problème précis ; ii. discute et évalue les différentes implications de l'utilisation de la science et de son application lors de la résolution d'un problème ou d'un questionnement précis en interaction avec plusieurs des facteurs suivants : la morale, l'éthique, la culture, l'économie, la politique et l'environnement ; iii. applique de façon cohérente un raisonnement scientifique de façon efficace pour prendre une décision."
        }
      }
    },
    pei2: "same_as_pei1",
    pei3: {
      A: {
        titre: "Connaissances et compréhension",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. indique des connaissances scientifiques ; ii. applique des connaissances scientifiques pour résoudre des problèmes présentés dans des situations familières ; iii. applique, avec de l'aide, de l'information pour formuler une explication scientifiquement valable.",
          "3-4": "L'élève : i. décrit des connaissances scientifiques ; ii. applique des connaissances scientifiques pour résoudre des problèmes présentés dans des situations familières et suggère des solutions aux problèmes présentés dans des situations non familières ; iii. applique de l'information pour formuler une explication scientifiquement valable.",
          "5-6": "L'élève : i. résume des connaissances scientifiques ; ii. applique des connaissances scientifiques pour résoudre des problèmes présentés dans des situations familières et non familières ; iii. applique de l'information pour formuler des explications et prédictions en construisant des arguments scientifiques.",
          "7-8": "L'élève : i. explique des connaissances scientifiques ; ii. applique des connaissances scientifiques pour résoudre des problèmes présentés dans des situations familières et non familières ; iii. analyse et évalue de l'information pour formuler des explications et prédictions en construisant des arguments scientifiques."
        }
      },
      B: {
        titre: "Recherche et élaboration",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. indique le problème à résoudre ou la question à explorer ; ii. indique une hypothèse vérifiable ; iii. indique, avec de l'aide, comment manipuler les variables et décrit la manière de recueillir les données pertinentes ; iv. élabore une méthode, avec de l'aide.",
          "3-4": "L'élève : i. résume le problème ou la question qui sera étudié ; ii. formule et explique une hypothèse vérifiable à l'aide d'un raisonnement scientifique ; iii. décrit comment manipuler les variables et décrit la manière de recueillir des données pertinentes ; iv. élabore une méthode complète qui indique le matériel et les instruments requis.",
          "5-6": "L'élève : i. décrit le problème ou la question qui sera étudié et indique les variables pertinentes ; ii. formule et explique une hypothèse vérifiable à l'aide d'un raisonnement scientifique ; iii. explique comment manipuler les variables et décrit la manière de recueillir suffisamment de données pertinentes ; iv. élabore une méthode logique et complète qui indique le matériel et les instruments nécessaires.",
          "7-8": "L'élève : i. décrit le problème ou la question qui sera étudié et indique les variables pertinentes ; ii. formule et explique une hypothèse vérifiable à l'aide d'un raisonnement scientifique correct ; iii. explique comment manipuler les variables et décrit la manière de recueillir suffisamment de données pertinentes ; iv. élabore une méthode logique, complète et sûre qui indique le matériel et les instruments nécessaires."
        }
      },
      C: {
        titre: "Traitement et évaluation",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. recueille et présente les données dans des représentations numériques ou visuelles ; ii. interprète des données ; iii. indique la validité des résultats, avec de l'aide.",
          "3-4": "L'élève : i. organise et présente correctement les données à l'aide de représentations numériques ou visuelles ; ii. interprète avec précision les données et explique les résultats ; iii. explique la validité des résultats.",
          "5-6": "L'élève : i. organise, transforme et présente correctement les données dans des représentations numériques ou visuelles ; ii. interprète avec précision les données et explique les résultats à l'aide d'un raisonnement scientifique ; iii. discute de la validité des résultats en se basant sur les résultats.",
          "7-8": "L'élève : i. organise, transforme et présente correctement les données sous forme numérique ou visuelle ; ii. interprète avec précision les données et explique les résultats à l'aide d'un raisonnement scientifique correct ; iii. évalue la validité des résultats en s'appuyant sur les résultats et explique les améliorations ou les prolongements possibles de la méthode."
        }
      },
      D: {
        titre: "Réflexion sur les répercussions de la science",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. indique les manières dont la science est appliquée et utilisée pour répondre à un besoin ou résoudre un problème précis ; ii. indique les implications de l'utilisation de la science et son application lors de la résolution d'un problème ou d'un questionnement précis ; iii. applique, avec de l'aide, un raisonnement scientifique de façon efficace pour prendre une décision.",
          "3-4": "L'élève : i. résume les manières dont la science est appliquée et utilisée pour répondre à un besoin ou résoudre un problème précis ; ii. décrit les implications de l'utilisation de la science et de son application lors de la résolution d'un problème ou d'un questionnement précis en interaction avec un des facteurs suivants : la morale, l'éthique, la culture, l'économie, la politique et l'environnement ; iii. applique un raisonnement scientifique de façon efficace pour prendre une décision.",
          "5-6": "L'élève : i. décrit les manières dont la science est appliquée et utilisée pour répondre à un besoin ou résoudre un problème précis ; ii. discute et résume les implications de l'utilisation de la science et de son application lors de la résolution d'un problème ou d'un questionnement précis en interaction avec un des facteurs suivants : la morale, l'éthique, la culture, l'économie, la politique et l'environnement ; iii. applique de façon cohérente un raisonnement scientifique de façon efficace pour prendre une décision.",
          "7-8": "L'élève : i. décrit et résume les manières dont la science est appliquée et utilisée pour répondre à un besoin ou résoudre un problème précis ; ii. discute et évalue les différentes implications de l'utilisation de la science et de son application lors de la résolution d'un problème ou d'un questionnement précis en interaction avec plusieurs des facteurs suivants : la morale, l'éthique, la culture, l'économie, la politique et l'environnement ; iii. applique de façon cohérente un raisonnement scientifique de façon efficace pour prendre une décision."
        }
      }
    },
    pei4: "same_as_pei3",
    pei5: {
      A: {
        titre: "Connaissances et compréhension",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. indique des connaissances scientifiques ; ii. applique des connaissances scientifiques pour résoudre des problèmes présentés dans des situations familières ; iii. applique, avec de l'aide, de l'information pour formuler une explication scientifiquement valable.",
          "3-4": "L'élève : i. décrit des connaissances scientifiques ; ii. applique des connaissances scientifiques pour résoudre des problèmes présentés dans des situations familières et suggère des solutions aux problèmes présentés dans des situations non familières ; iii. interprète de l'information pour formuler une explication scientifiquement valable.",
          "5-6": "L'élève : i. explique des connaissances scientifiques ; ii. applique des connaissances scientifiques pour résoudre des problèmes présentés dans des situations familières et non familières ; iii. interprète de l'information pour formuler des explications et prédictions en construisant des arguments scientifiques.",
          "7-8": "L'élève : i. explique des connaissances scientifiques ; ii. applique des connaissances scientifiques pour résoudre des problèmes présentés dans des situations familières et non familières ; iii. analyse et évalue de l'information pour formuler des explications et prédictions en construisant des arguments scientifiques."
        }
      },
      B: {
        titre: "Recherche et élaboration",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. indique le problème à résoudre ou la question à explorer ; ii. indique une hypothèse vérifiable ; iii. indique, avec de l'aide, comment manipuler les variables et décrit la manière de recueillir les données pertinentes ; iv. élabore une méthode, avec de l'aide.",
          "3-4": "L'élève : i. résume le problème ou la question qui sera étudié ; ii. formule et explique une hypothèse vérifiable à l'aide de théories scientifiques ; iii. décrit comment manipuler les variables et décrit la manière de recueillir des données pertinentes ; iv. élabore une méthode complète qui indique le matériel et les instruments requis.",
          "5-6": "L'élève : i. décrit le problème ou la question qui sera étudié et indique les variables pertinentes ; ii. formule et explique une hypothèse vérifiable à l'aide de théories scientifiques ; iii. explique comment manipuler les variables et décrit la manière de recueillir suffisamment de données pertinentes ; iv. élabore une méthode logique et complète qui indique le matériel et les instruments nécessaires.",
          "7-8": "L'élève : i. décrit le problème ou la question qui sera étudié et indique les variables pertinentes ; ii. formule et explique une hypothèse vérifiable à l'aide de théories scientifiques correctes ; iii. explique comment manipuler les variables et décrit la manière de recueillir suffisamment de données pertinentes ; iv. élabore une méthode logique, complète et sûre qui indique le matériel et les instruments nécessaires."
        }
      },
      C: {
        titre: "Traitement et évaluation",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. recueille et présente les données dans des représentations numériques ou visuelles ; ii. interprète des données ; iii. indique la validité d'une hypothèse sur la base des résultats d'une recherche scientifique ; iv. indique la validité de la méthode avec de l'aide ; v. indique les améliorations ou les prolongements des méthodes qui donneraient plus de données.",
          "3-4": "L'élève : i. organise et présente correctement les données à l'aide de représentations numériques ou visuelles ; ii. interprète avec précision les données et explique les résultats ; iii. décrit la validité d'une hypothèse sur la base des résultats d'une recherche scientifique ; iv. décrit la validité de la méthode sur la base des résultats d'une recherche scientifique ; v. décrit les améliorations ou les prolongements des méthodes qui donneraient plus de données.",
          "5-6": "L'élève : i. organise, transforme et présente correctement les données sous forme numérique ou visuelle ; ii. interprète avec précision les données et explique les résultats à l'aide d'un raisonnement scientifique ; iii. explique la validité d'une hypothèse sur la base des résultats d'une recherche scientifique ; iv. explique la validité de la méthode sur la base des résultats d'une recherche scientifique ; v. explique les améliorations ou les prolongements des méthodes qui donneraient plus de données.",
          "7-8": "L'élève : i. organise, transforme et présente correctement les données sous forme numérique ou visuelle ; ii. interprète avec précision les données et explique les résultats à l'aide d'un raisonnement scientifique correct ; iii. évalue la validité d'une hypothèse sur la base des résultats d'une recherche scientifique ; iv. évalue la validité de la méthode sur la base des résultats d'une recherche scientifique ; v. explique les améliorations ou les prolongements des méthodes qui donneraient plus de données selon les faiblesses et les limites de la méthode."
        }
      },
      D: {
        titre: "Réflexion sur les répercussions de la science",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. indique les manières dont la science est appliquée et utilisée pour répondre à un besoin ou résoudre un problème précis ; ii. indique les implications de l'utilisation de la science et son application lors de la résolution d'un problème ou d'un questionnement précis ; iii. applique, avec de l'aide, un raisonnement scientifique de façon efficace pour prendre une décision.",
          "3-4": "L'élève : i. résume les manières dont la science est appliquée et utilisée pour répondre à un besoin ou résoudre un problème précis ; ii. décrit les implications de l'utilisation de la science et de son application lors de la résolution d'un problème ou d'un questionnement précis en interaction avec un des facteurs suivants : la morale, l'éthique, la culture, l'économie, la politique et l'environnement ; iii. applique un raisonnement scientifique de façon efficace pour prendre une décision.",
          "5-6": "L'élève : i. décrit les manières dont la science est appliquée et utilisée pour répondre à un besoin ou résoudre un problème précis ; ii. discute et résume les implications de l'utilisation de la science et de son application lors de la résolution d'un problème ou d'un questionnement précis en interaction avec un des facteurs suivants : la morale, l'éthique, la culture, l'économie, la politique et l'environnement ; iii. applique de façon cohérente un raisonnement scientifique de façon efficace pour prendre une décision.",
          "7-8": "L'élève : i. explique les manières dont la science est utilisée et appliquée pour répondre à un besoin ou résoudre un problème précis ; ii. discute et évalue les différentes implications de l'utilisation de la science et de son application lors de la résolution d'un problème ou d'un questionnement précis en interaction avec plusieurs des facteurs suivants : la morale, l'éthique, la culture, l'économie, la politique et l'environnement ; iii. applique de façon cohérente un raisonnement scientifique de façon efficace pour prendre une décision."
        }
      }
    }
  },

  // ============================================================================
  // LANGUE ET LITTÉRATURE - PEI 1, 2, 3, 4, 5
  // ============================================================================
  "langue et littérature": {
    pei1: {
      A: {
        titre: "Analyse",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie quelques éléments de base dans un texte ; ii. identifie quelques informations de base et idées principales dans un texte.",
          "3-4": "L'élève : i. identifie les éléments dans un texte ; ii. identifie les informations et idées principales dans un texte ; iii. identifie les éléments dans des œuvres littéraires ou non littéraires et fait des liens pertinents avec sa propre culture et celle des autres cultures.",
          "5-6": "L'élève : i. décrit comment différents éléments sont utilisés dans un texte ; ii. explique les informations et les idées principales dans un texte ; iii. démontre comment les éléments dans des œuvres littéraires ou non littéraires reflètent sa propre culture et celle des autres cultures.",
          "7-8": "L'élève : i. analyse comment différents éléments sont utilisés dans un texte ; ii. analyse et résume les informations et les idées principales dans un texte ; iii. décrit comment les éléments dans des œuvres littéraires ou non littéraires reflètent sa propre culture et celle des autres cultures et leur impact sur l'auditoire."
        }
      },
      B: {
        titre: "Organisation",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. utilise une structure organisationnelle minimale pour ses idées et opinions ; ii. organise ses opinions et idées de manière limitée ; iii. utilise certains éléments de référencement et de mise en forme pour créer un style approprié au contexte et à l'intention.",
          "3-4": "L'élève : i. utilise une structure organisationnelle appropriée pour ses idées et opinions ; ii. organise ses opinions et idées de manière cohérente ; iii. utilise des éléments de référencement et de mise en forme pour créer un style approprié au contexte et à l'intention.",
          "5-6": "L'élève : i. utilise une structure organisationnelle variée et appropriée pour ses idées et opinions ; ii. organise ses opinions et idées de manière logique ; iii. utilise une gamme d'éléments de référencement et de mise en forme pour créer un style personnel approprié au contexte et à l'intention.",
          "7-8": "L'élève : i. utilise une structure organisationnelle variée et efficace pour ses idées et opinions ; ii. organise efficacement ses opinions et idées de manière logique ; iii. utilise efficacement une gamme d'éléments de référencement et de mise en forme pour créer un style personnel approprié au contexte et à l'intention."
        }
      },
      C: {
        titre: "Production de texte",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. produit des textes qui démontrent une connaissance limitée du contexte et de l'auditoire ; ii. produit des textes qui démontrent une connaissance limitée du but ; iii. choisit quelques détails et exemples pertinents.",
          "3-4": "L'élève : i. produit des textes qui démontrent une connaissance du contexte et de l'auditoire ; ii. produit des textes qui démontrent une connaissance du but ; iii. choisit des détails et des exemples pertinents.",
          "5-6": "L'élève : i. produit des textes qui démontrent une bonne compréhension du contexte et de l'auditoire ; ii. produit des textes qui démontrent une bonne compréhension du but ; iii. choisit des détails et des exemples suffisants et pertinents.",
          "7-8": "L'élève : i. produit des textes qui démontrent une conscience et une sensibilité envers le contexte et l'auditoire ; ii. produit des textes qui démontrent une excellente compréhension du but ; iii. choisit des détails et des exemples pertinents, variés et efficaces."
        }
      },
      D: {
        titre: "Utilisation de la langue",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. utilise un vocabulaire limité et un usage limité de figures de style ; ii. rédige et parle avec un niveau limité d'exactitude grammaticale, variété et complexité de structures ; iii. rédige et parle avec peu de clarté et de cohérence ; iv. épelle ou prononce avec un niveau limité d'exactitude ; v. utilise la ponctuation avec un niveau limité d'exactitude.",
          "3-4": "L'élève : i. utilise un vocabulaire approprié et adéquat et des figures de style ; ii. rédige et parle avec un niveau adéquat d'exactitude grammaticale, variété et complexité de structures ; iii. rédige et parle de manière généralement claire et cohérente ; iv. épelle ou prononce avec un niveau adéquat d'exactitude ; v. utilise la ponctuation avec un niveau adéquat d'exactitude.",
          "5-6": "L'élève : i. utilise un vocabulaire varié et pertinent et des figures de style ; ii. rédige et parle avec un bon niveau d'exactitude grammaticale, variété et complexité de structures ; iii. rédige et parle de manière claire et cohérente ; iv. épelle ou prononce avec un niveau considérable d'exactitude ; v. utilise la ponctuation avec un niveau considérable d'exactitude.",
          "7-8": "L'élève : i. utilise efficacement un vocabulaire varié, pertinent et approprié et des figures de style ; ii. rédige et parle avec un haut niveau d'exactitude grammaticale, variété et complexité de structures ; iii. rédige et parle de manière efficace, claire et cohérente ; iv. épelle ou prononce avec un haut niveau d'exactitude ; v. utilise la ponctuation avec un haut niveau d'exactitude."
        }
      }
    },
    pei2: "same_as_pei1",
    pei3: {
      A: {
        titre: "Analyse",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie et commente les connaissances, les idées et les opinions dans un texte ; ii. identifie et commente les éléments, les techniques et le style dans un texte.",
          "3-4": "L'élève : i. décrit les connaissances, les idées et les opinions dans un texte ; ii. décrit les éléments, les techniques et le style dans un texte ; iii. identifie et commente les effets des choix que font les créateurs sur un auditoire.",
          "5-6": "L'élève : i. résume les connaissances, les idées et les opinions dans un texte ; ii. résume les éléments, les techniques et le style dans un texte ; iii. explique les effets des choix que font les créateurs sur un auditoire.",
          "7-8": "L'élève : i. analyse les connaissances, les idées et les opinions dans un texte ; ii. analyse les éléments, les techniques et le style dans un texte ; iii. justifie les opinions et les idées à l'aide d'exemples, d'explications et de terminologie ; iv. évalue les effets des choix que font les créateurs sur un auditoire."
        }
      },
      B: {
        titre: "Organisation",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. utilise une structure organisationnelle minimale pour ses idées et opinions ; ii. organise ses opinions et idées de manière limitée ; iii. utilise certains éléments de référencement et de mise en forme pour créer un style approprié au contexte et à l'intention.",
          "3-4": "L'élève : i. utilise une structure organisationnelle appropriée pour ses idées et opinions ; ii. organise ses opinions et idées de manière cohérente ; iii. utilise des éléments de référencement et de mise en forme pour créer un style approprié au contexte et à l'intention.",
          "5-6": "L'élève : i. utilise une structure organisationnelle variée et appropriée pour ses idées et opinions ; ii. organise ses opinions et idées de manière logique ; iii. utilise une gamme d'éléments de référencement et de mise en forme pour créer un style personnel approprié au contexte et à l'intention.",
          "7-8": "L'élève : i. utilise une structure organisationnelle variée et efficace pour ses idées et opinions ; ii. organise efficacement ses opinions et idées de manière logique ; iii. utilise efficacement une gamme d'éléments de référencement et de mise en forme pour créer un style personnel approprié au contexte et à l'intention."
        }
      },
      C: {
        titre: "Production de texte",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. produit des textes qui démontrent une connaissance limitée du contexte et de l'auditoire ; ii. produit des textes qui démontrent une connaissance limitée du but ; iii. choisit quelques détails et exemples pertinents.",
          "3-4": "L'élève : i. produit des textes qui démontrent une connaissance du contexte et de l'auditoire ; ii. produit des textes qui démontrent une connaissance du but ; iii. choisit des détails et des exemples pertinents.",
          "5-6": "L'élève : i. produit des textes qui démontrent une bonne compréhension du contexte et de l'auditoire ; ii. produit des textes qui démontrent une bonne compréhension du but ; iii. choisit des détails et des exemples suffisants et pertinents.",
          "7-8": "L'élève : i. produit des textes qui démontrent une conscience et une sensibilité envers le contexte et l'auditoire ; ii. produit des textes qui démontrent une excellente compréhension du but ; iii. choisit des détails et des exemples pertinents, variés et efficaces."
        }
      },
      D: {
        titre: "Utilisation de la langue",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. utilise un vocabulaire limité et un usage limité de figures de style ; ii. rédige et parle avec un niveau limité d'exactitude grammaticale, variété et complexité de structures ; iii. rédige et parle avec peu de clarté et de cohérence ; iv. épelle ou prononce avec un niveau limité d'exactitude ; v. utilise la ponctuation avec un niveau limité d'exactitude.",
          "3-4": "L'élève : i. utilise un vocabulaire et des figures de style appropriés et adéquats ; ii. rédige et parle avec un niveau adéquat d'exactitude grammaticale, variété et complexité de structures ; iii. rédige et parle de manière généralement claire et cohérente ; iv. épelle ou prononce avec un niveau adéquat d'exactitude ; v. utilise la ponctuation avec un niveau adéquat d'exactitude.",
          "5-6": "L'élève : i. utilise un vocabulaire varié et des figures de style appropriés ; ii. rédige et parle avec un bon niveau d'exactitude grammaticale, variété et complexité de structures ; iii. rédige et parle de manière claire et cohérente ; iv. épelle ou prononce avec un niveau considérable d'exactitude ; v. utilise la ponctuation avec un niveau considérable d'exactitude.",
          "7-8": "L'élève : i. utilise efficacement un vocabulaire varié et des figures de style appropriés ; ii. rédige et parle avec un haut niveau d'exactitude grammaticale, variété et complexité de structures ; iii. rédige et parle de manière efficace, claire et cohérente ; iv. épelle ou prononce avec un haut niveau d'exactitude ; v. utilise la ponctuation avec un haut niveau d'exactitude."
        }
      }
    },
    pei4: "same_as_pei3",
    pei5: {
      A: {
        titre: "Analyse",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie et commente les connaissances, les idées et les opinions dans un texte ; ii. identifie et commente les éléments, les techniques et le style dans un texte.",
          "3-4": "L'élève : i. analyse et résume les connaissances, les idées et les opinions dans un texte ; ii. analyse et résume les éléments, les techniques et le style dans un texte ; iii. justifie les opinions et les idées à l'aide d'exemples, d'explications et de terminologie.",
          "5-6": "L'élève : i. analyse en détail les connaissances, les idées et les opinions dans un texte ; ii. analyse en détail les éléments, les techniques et le style dans un texte ; iii. justifie les opinions et les idées en profondeur à l'aide d'exemples, d'explications et de terminologie ; iv. évalue les effets des choix que font les créateurs sur un auditoire.",
          "7-8": "L'élève : i. analyse et évalue en profondeur les connaissances, les idées et les opinions dans un texte ; ii. analyse et évalue en profondeur les éléments, les techniques et le style dans un texte ; iii. justifie pertinemment les opinions et les idées à l'aide d'exemples, d'explications et de terminologie ; iv. évalue en profondeur les effets des choix que font les créateurs sur un auditoire."
        }
      },
      B: {
        titre: "Organisation",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. utilise une structure organisationnelle minimale pour ses idées et opinions ; ii. organise ses opinions et idées de manière limitée ; iii. utilise certains éléments de référencement et de mise en forme pour créer un style approprié au contexte et à l'intention.",
          "3-4": "L'élève : i. utilise une structure organisationnelle appropriée pour ses idées et opinions ; ii. organise ses opinions et idées de manière cohérente ; iii. utilise des éléments de référencement et de mise en forme pour créer un style approprié au contexte et à l'intention.",
          "5-6": "L'élève : i. utilise une structure organisationnelle variée et appropriée pour ses idées et opinions ; ii. organise ses opinions et idées de manière logique ; iii. utilise une gamme d'éléments de référencement et de mise en forme pour créer un style personnel approprié au contexte et à l'intention.",
          "7-8": "L'élève : i. utilise une structure organisationnelle variée et efficace pour ses idées et opinions ; ii. organise efficacement ses opinions et idées de manière logique ; iii. utilise efficacement une gamme d'éléments de référencement et de mise en forme pour créer un style personnel approprié au contexte et à l'intention."
        }
      },
      C: {
        titre: "Production de texte",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. produit des textes qui démontrent une connaissance limitée du contexte et de l'auditoire ; ii. produit des textes qui démontrent une connaissance limitée du but ; iii. choisit quelques détails et exemples pertinents.",
          "3-4": "L'élève : i. produit des textes qui démontrent une connaissance du contexte et de l'auditoire ; ii. produit des textes qui démontrent une connaissance du but ; iii. choisit des détails et des exemples pertinents.",
          "5-6": "L'élève : i. produit des textes qui démontrent une bonne compréhension du contexte et de l'auditoire ; ii. produit des textes qui démontrent une bonne compréhension du but ; iii. choisit des détails et des exemples suffisants, pertinents et justifiés.",
          "7-8": "L'élève : i. produit des textes qui démontrent une compréhension perceptive du contexte et de l'auditoire ; ii. produit des textes qui démontrent une excellente compréhension du but ; iii. choisit des détails et des exemples pertinents, variés, efficaces et justifiés."
        }
      },
      D: {
        titre: "Utilisation de la langue",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. utilise un vocabulaire limité et un usage limité de figures de style ; ii. rédige et parle avec un niveau limité d'exactitude grammaticale, variété et complexité de structures ; iii. rédige et parle avec peu de clarté et de cohérence ; iv. épelle ou prononce avec un niveau limité d'exactitude ; v. utilise la ponctuation avec un niveau limité d'exactitude.",
          "3-4": "L'élève : i. utilise un vocabulaire et des figures de style appropriés et adéquats ; ii. rédige et parle avec un niveau adéquat d'exactitude grammaticale, variété et complexité de structures ; iii. rédige et parle de manière généralement claire et cohérente ; iv. épelle ou prononce avec un niveau adéquat d'exactitude ; v. utilise la ponctuation avec un niveau adéquat d'exactitude.",
          "5-6": "L'élève : i. utilise efficacement un vocabulaire varié et des figures de style appropriés ; ii. rédige et parle avec un bon niveau d'exactitude grammaticale, variété et complexité de structures ; iii. rédige et parle de manière claire, cohérente et convaincante ; iv. épelle ou prononce avec un niveau considérable d'exactitude ; v. utilise la ponctuation avec un niveau considérable d'exactitude.",
          "7-8": "L'élève : i. utilise efficacement un vocabulaire varié, nuancé et des figures de style appropriés ; ii. rédige et parle avec un haut niveau d'exactitude grammaticale, variété et complexité de structures ; iii. rédige et parle de manière efficace, claire, cohérente, convaincante et nuancée ; iv. épelle ou prononce avec un haut niveau d'exactitude ; v. utilise la ponctuation avec un haut niveau d'exactitude."
        }
      }
    }
  },

  // ============================================================================
  // INDIVIDUS ET SOCIÉTÉS - PEI 1, 2, 3, 4, 5
  // ============================================================================
  "individus et sociétés": {
    pei1: {
      A: {
        titre: "Connaissances et compréhension",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. utilise une terminologie limitée pour le groupe de matières ; ii. démontre des connaissances et une compréhension de base du contenu et des concepts, à l'aide d'exemples et d'une description minimale.",
          "3-4": "L'élève : i. utilise une certaine terminologie pour le groupe de matières ; ii. démontre des connaissances et une compréhension du contenu et des concepts, à l'aide d'exemples et de description.",
          "5-6": "L'élève : i. utilise une terminologie précise pour le groupe de matières ; ii. démontre des connaissances et une compréhension du contenu et des concepts, à l'aide d'une description, d'exemples et d'explications.",
          "7-8": "L'élève : i. utilise une terminologie large pour le groupe de matières ; ii. démontre des connaissances détaillées et une compréhension du contenu et des concepts, à l'aide d'une description, d'exemples et d'explications approfondies."
        }
      },
      B: {
        titre: "Recherche",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. avec de l'aide, indique un sujet de recherche clair et explique son importance ; ii. avec de l'aide, recueille et note l'information des sources ; iii. avec de l'aide, organise l'information recueillie conformément aux attentes de la recherche.",
          "3-4": "L'élève : i. avec de l'aide, formule un sujet de recherche clair et décrit son importance ; ii. avec de l'aide, formule et suit un plan d'action pour étudier un sujet de recherche ; iii. avec de l'aide, utilise des méthodes de recherche pour recueillir et noter l'information pertinente ; iv. avec de l'aide, évalue le processus et les résultats de la recherche.",
          "5-6": "L'élève : i. formule un sujet de recherche clair et justifie son importance ; ii. formule et suit un plan d'action pour étudier un sujet de recherche ; iii. utilise des méthodes de recherche pour recueillir et noter l'information pertinente ; iv. évalue le processus et les résultats de la recherche.",
          "7-8": "L'élève : i. formule et concentre un sujet de recherche clair et explique son importance ; ii. formule et suit de manière autonome un plan d'action pour étudier un sujet de recherche ; iii. utilise des méthodes de recherche pour recueillir et noter l'information pertinente et variée ; iv. évalue de manière critique le processus et les résultats de la recherche."
        }
      },
      C: {
        titre: "Communication",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. communique des informations et des idées de manière minimale ; ii. communique des informations et des idées selon un format ou un style limité.",
          "3-4": "L'élève : i. communique des informations et des idées d'une manière qui convient pour l'auditoire et le but ; ii. structure les informations et les idées de manière à présenter les données recueillies ; iii. crée une liste de références et mentionne les sources de l'information avec de l'aide.",
          "5-6": "L'élève : i. communique des informations et des idées de manière claire et organisée pour l'auditoire et le but ; ii. structure les informations et les idées de manière à présenter les données recueillies de façon logique ; iii. crée une liste de références et mentionne les sources de l'information avec quelques omissions.",
          "7-8": "L'élève : i. communique des informations et des idées efficacement de manière claire et organisée pour l'auditoire et le but ; ii. structure les informations et les idées d'une manière logique et efficace à présenter les données recueillies ; iii. crée une liste de références complète et mentionne toujours les sources de l'information."
        }
      },
      D: {
        titre: "Pensée critique",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie les idées principales, les événements, les arguments visuels ou les thèmes dans un éventail de sources ; ii. avec de l'aide, analyse des concepts, événements, problèmes, modèles et arguments ; iii. avec de l'aide, résume des informations pour faire des arguments valables, bien fondés.",
          "3-4": "L'élève : i. analyse des concepts, des problèmes, des modèles, des tendances et des arguments ; ii. résume des informations pour faire des arguments valables et bien fondés ; iii. analyse et évalue un éventail de sources et d'informations en termes d'origine et de but ; iv. identifie différentes perspectives et implique certaines de leurs répercussions.",
          "5-6": "L'élève : i. analyse en détail des concepts, des problèmes, des modèles, des tendances et des arguments ; ii. analyse et évalue un éventail de sources et d'informations en termes d'origine et de but, identifiant les valeurs et les limites ; iii. interprète différentes perspectives et leurs répercussions ; iv. synthétise des informations pour faire des arguments valables et bien fondés.",
          "7-8": "L'élève : i. discute de manière approfondie des concepts, des problèmes, des modèles, des tendances et des arguments ; ii. analyse et évalue de manière approfondie un éventail de sources et d'informations en termes d'origine et de but, identifiant les valeurs et les limites ; iii. interprète différentes perspectives et de manière approfondie leurs répercussions ; iv. synthétise des informations pour faire des arguments valables, bien fondés et convaincants."
        }
      }
    },
    pei2: "same_as_pei1",
    pei3: {
      A: {
        titre: "Connaissances et compréhension",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. utilise une terminologie limitée pour le groupe de matières ; ii. démontre des connaissances et une compréhension de base du contenu et des concepts par une description minimale.",
          "3-4": "L'élève : i. utilise une certaine terminologie pour le groupe de matières ; ii. démontre des connaissances et une compréhension du contenu et des concepts par une description.",
          "5-6": "L'élève : i. utilise une terminologie précise pour le groupe de matières ; ii. démontre des connaissances et une compréhension du contenu et des concepts par une description et une explication.",
          "7-8": "L'élève : i. utilise une large gamme de terminologie pour le groupe de matières ; ii. démontre des connaissances détaillées et une compréhension du contenu et des concepts par une description et une explication approfondies."
        }
      },
      B: {
        titre: "Recherche",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. avec de l'aide, formule un sujet de recherche clair et explique son importance ; ii. avec de l'aide, formule et suit un plan d'action pour étudier un sujet de recherche ; iii. avec de l'aide, utilise des méthodes de recherche pour recueillir et noter l'information pertinente ; iv. avec de l'aide, évalue le processus et les résultats de la recherche.",
          "3-4": "L'élève : i. formule un sujet de recherche qui peut être ciblé et décrit son importance ; ii. formule et suit un plan d'action partiel pour étudier un sujet de recherche ; iii. utilise une méthode de recherche pour recueillir et noter l'information généralement pertinente ; iv. évalue certains aspects du processus et des résultats de la recherche.",
          "5-6": "L'élève : i. formule et concentre un sujet de recherche clair et explique son importance ; ii. formule et suit essentiellement un plan d'action pour étudier un sujet de recherche ; iii. utilise des méthodes de recherche pour recueillir et noter l'information généralement pertinente ; iv. évalue le processus et les résultats de la recherche avec de l'aide.",
          "7-8": "L'élève : i. formule et concentre un sujet de recherche clair et justifie son importance ; ii. formule et suit un plan d'action complet pour étudier un sujet de recherche ; iii. utilise des méthodes de recherche pour recueillir et noter l'information appropriée et variée ; iv. évalue le processus de recherche et les résultats de manière critique."
        }
      },
      C: {
        titre: "Communication",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. communique des informations et des idées de manière minimale ; ii. communique des informations et des idées selon un format ou un style limité.",
          "3-4": "L'élève : i. communique des informations et des idées de manière satisfaisante en utilisant un style approprié pour l'auditoire et le but ; ii. structure les informations et les idées selon le format ou le style indiqué ; iii. documente les sources de l'information en utilisant un système de référencement avec des orientations.",
          "5-6": "L'élève : i. communique des informations et des idées de manière claire en utilisant un style approprié pour l'auditoire et le but ; ii. structure les informations et les idées de manière à utiliser l'illustration et la présentation pour présenter les données recueillies ; iii. documente les sources de l'information en utilisant un système de référencement avec quelques omissions.",
          "7-8": "L'élève : i. communique des informations et des idées efficacement en utilisant un style approprié pour l'auditoire et le but ; ii. structure les informations et les idées de manière à utiliser l'illustration et la présentation pour présenter les données recueillies de façon logique ; iii. documente les sources de l'information en utilisant un système de référencement de manière complète."
        }
      },
      D: {
        titre: "Pensée critique",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie les idées principales, les événements, les arguments visuels ou les thèmes ; ii. avec de l'aide, utilise des informations pour justifier une opinion ; iii. avec de l'aide, identifie et analyse un éventail de sources ou d'informations en termes d'origine et de but.",
          "3-4": "L'élève : i. analyse des concepts, des problèmes, des modèles, des tendances et des arguments ; ii. résume des informations pour faire des arguments ; iii. identifie et analyse un éventail de sources ou d'informations en termes d'origine et de but, identifiant les valeurs et les limites ; iv. identifie différentes perspectives et suggère certaines de leurs répercussions.",
          "5-6": "L'élève : i. discute des concepts, des problèmes, des modèles, des tendances et des arguments ; ii. synthétise des informations pour faire des arguments valables ; iii. analyse et évalue un éventail de sources et d'informations en termes d'origine et de but, identifiant généralement les valeurs et les limites ; iv. interprète différentes perspectives et certaines de leurs répercussions.",
          "7-8": "L'élève : i. discute de manière approfondie des concepts, des problèmes, des modèles, des tendances et des arguments ; ii. synthétise des informations pour faire des arguments valables et bien fondés ; iii. analyse et évalue en profondeur un éventail de sources et d'informations en termes d'origine et de but, identifiant les valeurs et les limites ; iv. interprète en profondeur différentes perspectives et leurs répercussions."
        }
      }
    },
    pei4: "same_as_pei3",
    pei5: {
      A: {
        titre: "Connaissances et compréhension",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. utilise une terminologie limitée pour le groupe de matières ; ii. démontre des connaissances et une compréhension de base du contenu et des concepts à l'aide de descriptions et d'exemples minimaux.",
          "3-4": "L'élève : i. utilise une certaine terminologie du groupe de matières, de manière convenable ; ii. démontre des connaissances et une compréhension du contenu et des concepts à l'aide de descriptions, d'explications et d'exemples.",
          "5-6": "L'élève : i. utilise une terminologie du groupe de matières convenable et variée ; ii. démontre des connaissances et une compréhension du contenu et des concepts à l'aide de descriptions, d'explications et d'exemples détaillés.",
          "7-8": "L'élève : i. utilise une terminologie du groupe de matières vaste, précise et efficace ; ii. démontre des connaissances détaillées et une compréhension approfondie du contenu et des concepts à l'aide de descriptions, d'explications et d'exemples détaillés."
        }
      },
      B: {
        titre: "Recherche",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. avec de l'aide, formule un sujet de recherche et explique son importance ; ii. avec de l'aide, formule et suit un plan d'action pour étudier un sujet de recherche ; iii. avec de l'aide, utilise une méthode de recherche pour recueillir et noter l'information ; iv. avec de l'aide, évalue le processus et les résultats de la recherche.",
          "3-4": "L'élève : i. formule et concentre un sujet de recherche et décrit son importance ; ii. formule et quelquefois suit un plan d'action pour étudier un sujet de recherche ; iii. utilise une ou plusieurs méthodes de recherche pour recueillir et noter l'information convenable ; iv. évalue certains aspects du processus et des résultats de la recherche.",
          "5-6": "L'élève : i. formule et concentre un sujet de recherche et explique son importance ; ii. formule et suit essentiellement un plan d'action pour étudier un sujet de recherche ; iii. utilise des méthodes de recherche pour recueillir et noter l'information convenable et pertinente ; iv. évalue le processus et les résultats de la recherche.",
          "7-8": "L'élève : i. formule et concentre un sujet de recherche et justifie de manière approfondie son importance ; ii. formule et suit efficacement un plan d'action complet pour étudier un sujet de recherche ; iii. utilise des méthodes de recherche pour recueillir et noter l'information appropriée, pertinente et variée ; iv. évalue le processus et les résultats de la recherche de manière approfondie."
        }
      },
      C: {
        titre: "Communication",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. communique des informations et des idées d'une manière limitée ; ii. communique des informations et des idées selon un format ou un style limité.",
          "3-4": "L'élève : i. communique des informations et des idées de manière claire ; ii. organise les informations et les idées de manière convenable pour le format de la tâche ; iii. crée une liste de sources d'informations à l'aide d'un système de référencement avec des orientations.",
          "5-6": "L'élève : i. communique des informations et des idées de manière claire et organisée ; ii. organise les informations et les idées de manière à créer une présentation bien structurée en utilisant l'illustration et la présentation ; iii. crée une liste de sources d'informations à l'aide d'un système de référencement avec quelques omissions.",
          "7-8": "L'élève : i. communique des informations et des idées efficacement et de manière claire ; ii. organise les informations et les idées de manière logique et très bien structurée en utilisant l'illustration et la présentation ; iii. crée une liste complète de sources d'informations à l'aide d'un système de référencement."
        }
      },
      D: {
        titre: "Pensée critique",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie les idées principales, les événements, les arguments visuels ou les thèmes ; ii. avec de l'aide, utilise des informations pour justifier une opinion ; iii. avec de l'aide, identifie et analyse un éventail de sources et d'informations en termes d'origine et de but ; iv. avec de l'aide, identifie différentes perspectives et suggère certaines de leurs répercussions.",
          "3-4": "L'élève : i. analyse des concepts, des problèmes, des modèles, des tendances et des arguments ; ii. résume des informations pour faire des arguments ; iii. analyse un éventail de sources et d'informations en termes d'origine et de but, identifiant généralement les valeurs et les limites ; iv. identifie différentes perspectives et suggère leurs répercussions.",
          "5-6": "L'élève : i. discute des concepts, des problèmes, des modèles, des tendances et des arguments ; ii. synthétise des informations pour faire des arguments ; iii. analyse et évalue efficacement un éventail de sources et d'informations en termes d'origine et de but, identifiant généralement les valeurs et les limites ; iv. interprète différentes perspectives et leurs répercussions.",
          "7-8": "L'élève : i. discute de manière approfondie des concepts, des problèmes, des modèles, des tendances et des arguments ; ii. synthétise des informations pour faire des arguments valables, bien fondés et convaincants ; iii. analyse et évalue efficacement un éventail de sources et d'informations en termes d'origine et de but, identifiant les valeurs et les limites ; iv. interprète de manière approfondie différentes perspectives et leurs répercussions."
        }
      }
    }
  },

  // ============================================================================
  // MATHÉMATIQUES - PEI 1, 2, 3, 4, 5
  // ============================================================================
  mathématiques: {
    pei1: {
      A: {
        titre: "Connaissances et compréhension",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie quelques notions mathématiques élémentaires et fait quelques tentatives pour les appliquer pour résoudre des problèmes dans des situations familières ; ii. applique généralement, avec des erreurs, des compétences mathématiques lors de la tentative de résolution de problèmes dans des situations familières.",
          "3-4": "L'élève : i. identifie les notions mathématiques pertinentes et les applique pour résoudre des problèmes dans des situations familières ; ii. identifie et applique les compétences mathématiques appropriées lors de la résolution de problèmes dans des situations familières, généralement de façon efficace.",
          "5-6": "L'élève : i. sélectionne les notions mathématiques appropriées et les applique pour résoudre des problèmes dans des situations familières et non familières ; ii. sélectionne et applique avec succès les compétences mathématiques lors de la résolution de problèmes dans des situations familières et non familières.",
          "7-8": "L'élève : i. sélectionne les notions mathématiques appropriées et les applique pour résoudre des problèmes dans des situations familières et non familières et pour résoudre des problèmes réels ; ii. sélectionne et applique avec succès les compétences mathématiques lors de la résolution de problèmes dans des situations familières et non familières et pour résoudre des problèmes réels."
        }
      },
      B: {
        titre: "Recherche de modèles",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie, avec de l'aide, un modèle ; ii. identifie, avec de l'aide, des règles cohérentes au modèle.",
          "3-4": "L'élève : i. identifie un modèle ; ii. suggère des règles cohérentes au modèle.",
          "5-6": "L'élève : i. identifie et décrit un modèle ; ii. suggère et applique des règles cohérentes au modèle.",
          "7-8": "L'élève : i. décrit un modèle ; ii. suggère et applique des règles cohérentes au modèle ; iii. tire des conclusions cohérentes à partir du modèle."
        }
      },
      C: {
        titre: "Communication",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. tente d'utiliser une représentation mathématique appropriée pour présenter des informations ; ii. tente d'utiliser des formes appropriées de notation mathématique.",
          "3-4": "L'élève : i. utilise une représentation mathématique appropriée pour présenter des informations ; ii. utilise des formes appropriées de notation mathématique dans la plupart des cas.",
          "5-6": "L'élève : i. utilise une représentation mathématique appropriée pour présenter des informations de façon adéquate ; ii. utilise des formes appropriées de notation mathématique de façon adéquate ; iii. présente le travail de manière cohérente à l'aide d'explications verbales et des représentations.",
          "7-8": "L'élève : i. utilise une représentation mathématique variée et appropriée pour présenter des informations correctement ; ii. utilise des formes appropriées de notation mathématique correctement ; iii. présente le travail de façon organisée à l'aide d'explications verbales et des représentations."
        }
      },
      D: {
        titre: "Application des mathématiques dans des contextes réels",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie quelques-uns des éléments de la situation authentique dans le monde réel ; ii. tente d'appliquer, avec de l'aide, des stratégies mathématiques pour trouver une solution à la situation authentique dans le monde réel.",
          "3-4": "L'élève : i. identifie les éléments pertinents de la situation authentique dans le monde réel ; ii. suggère et applique des stratégies mathématiques pour trouver une solution à la situation authentique dans le monde réel ; iii. décrit, avec de l'aide, le niveau de précision d'une solution ; iv. décrit, avec de l'aide, si une solution a du sens dans le contexte de la situation authentique dans le monde réel.",
          "5-6": "L'élève : i. identifie les éléments pertinents de la situation authentique dans le monde réel et sélectionne, avec de l'aide, un cadre mathématique approprié ; ii. suggère et applique les stratégies mathématiques pour parvenir à une solution correcte à la situation authentique dans le monde réel ; iii. décrit le niveau de précision d'une solution ; iv. décrit si une solution a du sens dans le contexte de la situation authentique dans le monde réel.",
          "7-8": "L'élève : i. identifie les éléments pertinents de la situation authentique dans le monde réel, sélectionne un cadre mathématique approprié et simplifie la situation authentique dans le monde réel ; ii. suggère et applique avec succès une série de stratégies mathématiques pour parvenir à une solution valide, correcte et complète à la situation authentique dans le monde réel ; iii. explique le niveau de précision d'une solution ; iv. explique si une solution a du sens dans le contexte de la situation authentique dans le monde réel."
        }
      }
    },
    pei2: "same_as_pei1",
    pei3: {
      A: {
        titre: "Connaissances et compréhension",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie quelques notions mathématiques élémentaires et fait quelques tentatives pour les appliquer pour résoudre des problèmes dans des situations familières ; ii. applique généralement, avec des erreurs, des compétences mathématiques lors de la tentative de résolution de problèmes dans des situations familières.",
          "3-4": "L'élève : i. identifie les notions mathématiques pertinentes et les applique pour résoudre des problèmes dans des situations familières ; ii. identifie et applique les compétences mathématiques appropriées lors de la résolution de problèmes dans des situations familières, généralement de façon efficace.",
          "5-6": "L'élève : i. sélectionne les notions mathématiques appropriées et les applique pour résoudre des problèmes dans des situations familières et non familières ; ii. sélectionne et applique avec succès les compétences mathématiques lors de la résolution de problèmes dans des situations familières et non familières.",
          "7-8": "L'élève : i. sélectionne les notions mathématiques appropriées et les applique pour résoudre des problèmes complexes dans des situations familières et non familières ; ii. sélectionne et applique avec succès les compétences mathématiques lors de la résolution de problèmes complexes dans des situations familières et non familières."
        }
      },
      B: {
        titre: "Recherche de modèles",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. applique, avec de l'aide, des techniques mathématiques de résolution de problèmes pour identifier des modèles ; ii. identifie, avec de l'aide, des règles cohérentes au modèle.",
          "3-4": "L'élève : i. applique des techniques mathématiques de résolution de problèmes pour identifier des modèles ; ii. suggère des règles cohérentes au modèle.",
          "5-6": "L'élève : i. applique des techniques mathématiques de résolution de problèmes pour identifier des modèles ; ii. suggère des règles cohérentes au modèle ; iii. décrit un modèle en tant que règle générale cohérente avec les résultats.",
          "7-8": "L'élève : i. sélectionne et applique des techniques mathématiques de résolution de problèmes pour identifier des modèles ; ii. suggère des règles cohérentes au modèle ; iii. prouve ou vérifie et justifie un modèle en tant que règle générale."
        }
      },
      C: {
        titre: "Communication",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. tente d'utiliser une représentation mathématique appropriée pour présenter des informations ; ii. tente d'utiliser des formes appropriées de notation mathématique.",
          "3-4": "L'élève : i. utilise une représentation mathématique appropriée pour présenter des informations ; ii. utilise des formes appropriées de notation mathématique dans la plupart des cas ; iii. présente le travail de façon partiellement organisée à l'aide d'explications verbales.",
          "5-6": "L'élève : i. utilise une représentation mathématique appropriée pour présenter des informations de façon adéquate ; ii. utilise des formes appropriées de notation mathématique de façon adéquate ; iii. présente le travail de manière cohérente à l'aide d'explications verbales et des représentations ; iv. présente les lignes de raisonnement mathématique d'une manière cohérente.",
          "7-8": "L'élève : i. utilise une représentation mathématique variée et appropriée pour présenter des informations correctement ; ii. utilise des formes appropriées de notation mathématique correctement ; iii. présente le travail de façon organisée à l'aide d'explications verbales et des représentations ; iv. présente les lignes de raisonnement mathématique de façon cohérente et complète."
        }
      },
      D: {
        titre: "Application des mathématiques dans des contextes réels",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie quelques-uns des éléments de la situation authentique dans le monde réel ; ii. tente d'appliquer, avec de l'aide, des stratégies mathématiques pour trouver une solution à la situation authentique dans le monde réel.",
          "3-4": "L'élève : i. identifie les éléments pertinents de la situation authentique dans le monde réel ; ii. suggère et applique des stratégies mathématiques pour trouver une solution à la situation authentique dans le monde réel ; iii. fait des commentaires généraux sur la justesse d'une solution ; iv. décrit, avec de l'aide, si une solution a du sens dans le contexte de la situation authentique dans le monde réel.",
          "5-6": "L'élève : i. identifie les éléments pertinents de la situation authentique dans le monde réel et sélectionne, avec de l'aide, un cadre mathématique approprié ; ii. suggère et applique les stratégies mathématiques appropriées pour parvenir à une solution correcte à la situation authentique dans le monde réel ; iii. décrit la justesse de la solution ; iv. décrit si une solution a du sens dans le contexte de la situation authentique dans le monde réel.",
          "7-8": "L'élève : i. identifie les éléments pertinents de la situation authentique dans le monde réel, sélectionne un cadre mathématique approprié et simplifie la situation authentique dans le monde réel ; ii. suggère et applique avec succès une série de stratégies mathématiques pour parvenir à une solution valide, correcte et complète à la situation authentique dans le monde réel ; iii. explique la justesse de la solution ; iv. explique si une solution a du sens dans le contexte de la situation authentique dans le monde réel ; v. décrit comment le changement de variables peut affecter les résultats."
        }
      }
    },
    pei4: "same_as_pei3",
    pei5: {
      A: {
        titre: "Connaissances et compréhension",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie quelques notions mathématiques élémentaires et fait quelques tentatives pour les appliquer pour résoudre des problèmes dans des situations familières ; ii. applique généralement, avec des erreurs, des compétences mathématiques lors de la tentative de résolution de problèmes dans des situations familières.",
          "3-4": "L'élève : i. identifie les notions mathématiques pertinentes et les applique pour résoudre des problèmes dans des situations familières ; ii. identifie et applique les compétences mathématiques appropriées lors de la résolution de problèmes dans des situations familières, généralement de façon efficace.",
          "5-6": "L'élève : i. sélectionne les notions mathématiques appropriées et les applique pour résoudre des problèmes dans des situations familières et non familières ; ii. sélectionne et applique avec succès les compétences mathématiques lors de la résolution de problèmes dans des situations familières et non familières.",
          "7-8": "L'élève : i. sélectionne les notions mathématiques appropriées et les applique pour résoudre des problèmes complexes dans des situations familières et non familières ; ii. sélectionne et applique avec succès les compétences mathématiques lors de la résolution de problèmes complexes dans des situations familières et non familières."
        }
      },
      B: {
        titre: "Recherche de modèles",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. applique, avec de l'aide, des techniques mathématiques de résolution de problèmes pour identifier des modèles ; ii. identifie, avec de l'aide, des règles cohérentes au modèle.",
          "3-4": "L'élève : i. sélectionne et applique des techniques mathématiques de résolution de problèmes pour identifier des modèles ; ii. suggère des règles cohérentes au modèle.",
          "5-6": "L'élève : i. sélectionne et applique des techniques mathématiques de résolution de problèmes pour identifier des modèles ; ii. suggère et vérifie des règles cohérentes au modèle ; iii. suggère des relations et des règles générales cohérentes avec les résultats.",
          "7-8": "L'élève : i. sélectionne et applique des techniques mathématiques de résolution de problèmes pour identifier des modèles correctement ; ii. suggère et démontre des règles cohérentes au modèle ; iii. suggère des relations et des règles générales cohérentes avec les résultats ; iv. explique comment il a identifié les éléments d'un modèle."
        }
      },
      C: {
        titre: "Communication",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. tente d'utiliser une représentation mathématique appropriée pour présenter des informations ; ii. tente d'utiliser des formes appropriées de notation mathématique ; iii. tente de communiquer des informations mathématiques.",
          "3-4": "L'élève : i. utilise une représentation mathématique appropriée pour présenter des informations ; ii. utilise des formes appropriées de notation mathématique dans la plupart des cas ; iii. présente le travail de façon partiellement organisée à l'aide d'explications verbales ; iv. présente les lignes de raisonnement mathématique d'une manière limitée.",
          "5-6": "L'élève : i. utilise une représentation mathématique appropriée pour présenter des informations de façon adéquate ; ii. utilise des formes appropriées de notation mathématique de façon adéquate ; iii. présente le travail de manière cohérente à l'aide d'explications verbales et des représentations ; iv. présente les lignes de raisonnement mathématique d'une manière cohérente.",
          "7-8": "L'élève : i. utilise une représentation mathématique variée et appropriée pour présenter des informations correctement ; ii. utilise des formes appropriées de notation mathématique correctement ; iii. présente le travail de façon organisée à l'aide d'explications verbales et des représentations ; iv. présente les lignes de raisonnement mathématique de façon cohérente, concise et complète ; v. présente le travail en utilisant une structure et une stratégie appropriées."
        }
      },
      D: {
        titre: "Application des mathématiques dans des contextes réels",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie quelques-uns des éléments de la situation authentique dans le monde réel ; ii. tente d'appliquer, avec de l'aide, des stratégies mathématiques pour trouver une solution à la situation authentique dans le monde réel.",
          "3-4": "L'élève : i. identifie les éléments pertinents de la situation authentique dans le monde réel et essaye de sélectionner un cadre mathématique approprié ; ii. suggère et applique des stratégies mathématiques pour trouver une solution à la situation authentique dans le monde réel ; iii. fait des commentaires généraux sur la justesse d'une solution ; iv. décrit, avec de l'aide, si une solution a du sens dans le contexte de la situation authentique dans le monde réel.",
          "5-6": "L'élève : i. identifie les éléments pertinents de la situation authentique dans le monde réel, sélectionne un cadre mathématique approprié et simplifie le problème ; ii. suggère et applique les stratégies mathématiques appropriées pour parvenir à une solution correcte à la situation authentique dans le monde réel ; iii. décrit la justesse d'une solution et si une solution a du sens dans le contexte de la situation authentique dans le monde réel ; iv. décrit comment le changement de variables peut affecter les résultats.",
          "7-8": "L'élève : i. identifie les éléments pertinents de la situation authentique dans le monde réel, sélectionne un cadre mathématique approprié et simplifie le problème ; ii. suggère et applique avec succès une série de stratégies mathématiques pour parvenir à une solution valide, correcte et complète à la situation authentique dans le monde réel ; iii. explique la justesse de la solution et si une solution a du sens dans le contexte de la situation authentique dans le monde réel ; iv. justifie si une solution a du sens dans le contexte de la situation authentique dans le monde réel ; v. explique comment le changement de variables peut affecter les résultats."
        }
      }
    }
  },

  // ============================================================================
  // ARTS - débutant, intermédiaire, compétent
  // ============================================================================
  arts: {
    débutant: {
      A: {
        titre: "Recherche",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. énumère des aspects limités de l'œuvre d'art créée par d'autres personnes.",
          "3-4": "L'élève : i. énumère des aspects d'une œuvre d'art créée par d'autres personnes ; ii. démontre une utilisation limitée des connaissances acquises de l'œuvre d'art créée par d'autres personnes dans ses travaux artistiques.",
          "5-6": "L'élève : i. énumère et décrit des aspects d'une œuvre d'art créée par d'autres personnes ; ii. démontre l'utilisation des connaissances acquises de l'œuvre d'art créée par d'autres personnes dans ses travaux artistiques.",
          "7-8": "L'élève : i. décrit avec suffisamment de détails une œuvre d'art créée par d'autres personnes ; ii. démontre l'utilisation approfondie des connaissances acquises de l'œuvre d'art créée par d'autres personnes dans ses travaux artistiques ; iii. exprime des perspectives réfléchies sur l'œuvre d'art créée par d'autres personnes."
        }
      },
      B: {
        titre: "Développement",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. démontre une utilisation limitée de compétences et techniques artistiques ; ii. démontre une utilisation limitée de la création de croquis et de l'exploration d'idées.",
          "3-4": "L'élève : i. démontre la maîtrise de compétences et techniques artistiques ; ii. démontre l'utilisation de la création de croquis et de l'exploration d'idées.",
          "5-6": "L'élève : i. démontre une utilisation suffisante de compétences et techniques artistiques ; ii. démontre une utilisation suffisante de la création de croquis et de l'exploration d'idées ; iii. présente les idées artistiques de façon claire.",
          "7-8": "L'élève : i. démontre une utilisation excellente de compétences et techniques artistiques ; ii. démontre une utilisation excellente de la création de croquis et de l'exploration d'idées ; iii. présente les idées artistiques de façon détaillée et cohérente."
        }
      },
      C: {
        titre: "Création ou exécution",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. présente une intention artistique limitée ; ii. démontre une utilisation limitée de compétences et techniques artistiques ; iii. crée une œuvre artistique qui démontre des qualités limitées.",
          "3-4": "L'élève : i. présente une intention artistique ; ii. démontre une utilisation de compétences et techniques artistiques ; iii. crée une œuvre artistique qui démontre des qualités.",
          "5-6": "L'élève : i. présente une intention artistique claire ; ii. démontre une utilisation suffisante de compétences et techniques artistiques ; iii. crée une œuvre artistique qui démontre suffisamment de qualités.",
          "7-8": "L'élève : i. présente une intention artistique claire et réalisable ; ii. démontre une utilisation excellente de compétences et techniques artistiques ; iii. crée une œuvre artistique qui démontre des qualités excellentes ; iv. démontre une capacité d'explorer et de présenter des idées de manière disciplinée."
        }
      },
      D: {
        titre: "Évaluation",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. énumère des réussites et des lacunes limitées de ses travaux artistiques ; ii. démontre une conscience limitée de son développement personnel en tant qu'artiste.",
          "3-4": "L'élève : i. énumère des réussites et des lacunes de ses travaux artistiques ; ii. démontre une conscience de son développement personnel en tant qu'artiste.",
          "5-6": "L'élève : i. énumère et décrit des réussites et des lacunes de ses travaux artistiques ; ii. démontre une conscience suffisante de son développement personnel en tant qu'artiste.",
          "7-8": "L'élève : i. décrit avec suffisamment de détails des réussites et des lacunes de ses travaux artistiques ; ii. démontre une conscience approfondie de son développement personnel en tant qu'artiste ; iii. interprète avec perspicacité son intention en tant qu'artiste."
        }
      }
    },
    intermédiaire: {
      A: {
        titre: "Recherche",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. énumère des aspects limités de l'œuvre d'art et du contexte créés par d'autres personnes.",
          "3-4": "L'élève : i. énumère des aspects d'une œuvre d'art et du contexte créés par d'autres personnes ; ii. démontre une utilisation limitée des connaissances acquises de l'œuvre d'art et du contexte créés par d'autres personnes dans ses travaux artistiques.",
          "5-6": "L'élève : i. analyse et décrit avec suffisamment de détails une œuvre d'art et le contexte créés par d'autres personnes ; ii. démontre l'utilisation des connaissances acquises de l'œuvre d'art et du contexte créés par d'autres personnes dans ses travaux artistiques ; iii. exprime des perspectives sur l'œuvre d'art et le contexte créés par d'autres personnes.",
          "7-8": "L'élève : i. analyse et décrit en détail une œuvre d'art et le contexte créés par d'autres personnes ; ii. démontre l'utilisation approfondie des connaissances acquises de l'œuvre d'art et du contexte créés par d'autres personnes dans ses travaux artistiques ; iii. exprime des perspectives réfléchies et développées sur l'œuvre d'art et le contexte créés par d'autres personnes."
        }
      },
      B: {
        titre: "Développement",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. démontre une utilisation limitée de compétences et techniques artistiques ; ii. démontre une utilisation limitée de la création de croquis et de l'exploration d'idées.",
          "3-4": "L'élève : i. démontre une utilisation de compétences et techniques artistiques ; ii. démontre l'utilisation de la création de croquis et de l'exploration d'idées ; iii. présente les idées artistiques de façon généralement claire.",
          "5-6": "L'élève : i. démontre une utilisation suffisante et intentionnelle de compétences et techniques artistiques ; ii. démontre une utilisation suffisante et intentionnelle de la création de croquis et de l'exploration d'idées ; iii. présente les idées artistiques de façon claire et cohérente ; iv. démontre une capacité suffisante d'explorer et de présenter des idées de manière disciplinée.",
          "7-8": "L'élève : i. démontre une utilisation excellente et intentionnelle de compétences et techniques artistiques ; ii. démontre une utilisation excellente et intentionnelle de la création de croquis et de l'exploration d'idées ; iii. présente les idées artistiques de façon détaillée, logique et cohérente ; iv. démontre une capacité excellente d'explorer et de présenter des idées de manière disciplinée."
        }
      },
      C: {
        titre: "Création ou exécution",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. présente une intention artistique limitée ; ii. démontre une utilisation limitée de compétences et techniques artistiques ; iii. crée une œuvre artistique qui démontre des qualités limitées.",
          "3-4": "L'élève : i. présente une intention artistique ; ii. démontre une utilisation de compétences et techniques artistiques ; iii. crée une œuvre artistique qui démontre des qualités ; iv. démontre une capacité d'explorer et de présenter des idées de manière disciplinée.",
          "5-6": "L'élève : i. présente une intention artistique claire et réalisable ; ii. démontre une utilisation suffisante de compétences et techniques artistiques ; iii. crée une œuvre artistique qui démontre suffisamment de qualités ; iv. démontre une capacité suffisante d'explorer et de présenter des idées de manière disciplinée.",
          "7-8": "L'élève : i. présente une intention artistique claire, détaillée et réalisable ; ii. démontre une utilisation excellente de compétences et techniques artistiques ; iii. crée une œuvre artistique qui démontre des qualités excellentes ; iv. démontre une capacité excellente d'explorer et de présenter des idées de manière disciplinée."
        }
      },
      D: {
        titre: "Évaluation",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. énumère des réussites et des lacunes limitées de ses travaux artistiques ; ii. démontre une conscience limitée de son développement personnel en tant qu'artiste.",
          "3-4": "L'élève : i. énumère des réussites et des lacunes de ses travaux artistiques ; ii. démontre une conscience de son développement personnel en tant qu'artiste ; iii. interprète son intention en tant qu'artiste.",
          "5-6": "L'élève : i. décrit avec suffisamment de détails des réussites et des lacunes de ses travaux artistiques ; ii. démontre une conscience suffisante de son développement personnel en tant qu'artiste ; iii. interprète avec suffisamment de détails son intention en tant qu'artiste.",
          "7-8": "L'élève : i. décrit de façon critique avec suffisamment de détails des réussites et des lacunes de ses travaux artistiques ; ii. démontre une conscience approfondie de son développement personnel en tant qu'artiste ; iii. interprète de façon critique et avec perspicacité son intention en tant qu'artiste."
        }
      }
    },
    compétent: {
      A: {
        titre: "Recherche",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. énumère des aspects limités de l'œuvre d'art et du contexte créés par d'autres personnes.",
          "3-4": "L'élève : i. décrit de l'œuvre d'art et du contexte créés par d'autres personnes ; ii. démontre une utilisation des connaissances acquises de l'œuvre d'art et du contexte créés par d'autres personnes dans ses travaux artistiques ; iii. exprime des perspectives sur l'œuvre d'art et le contexte créés par d'autres personnes.",
          "5-6": "L'élève : i. analyse et décrit avec suffisamment de détails une œuvre d'art et le contexte créés par d'autres personnes ; ii. démontre une utilisation approfondie des connaissances acquises de l'œuvre d'art et du contexte créés par d'autres personnes dans ses travaux artistiques ; iii. exprime des perspectives réfléchies sur l'œuvre d'art et le contexte créés par d'autres personnes.",
          "7-8": "L'élève : i. analyse de manière critique et en détail une œuvre d'art et le contexte créés par d'autres personnes ; ii. démontre une utilisation approfondie et critique des connaissances acquises de l'œuvre d'art et du contexte créés par d'autres personnes dans ses travaux artistiques ; iii. exprime des perspectives réfléchies, développées et perspicaces sur l'œuvre d'art et le contexte créés par d'autres personnes."
        }
      },
      B: {
        titre: "Développement",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. démontre une utilisation limitée de compétences et techniques artistiques ; ii. démontre une utilisation limitée de la création de croquis et de l'exploration d'idées ; iii. présente les idées artistiques de façon limitée.",
          "3-4": "L'élève : i. démontre une utilisation suffisante et intentionnelle de compétences et techniques artistiques ; ii. démontre l'utilisation de la création de croquis et de l'exploration d'idées ; iii. présente les idées artistiques de façon claire ; iv. démontre une capacité d'explorer et de présenter des idées de manière disciplinée.",
          "5-6": "L'élève : i. démontre une utilisation suffisante, réfléchie et intentionnelle de compétences et techniques artistiques ; ii. démontre une utilisation suffisante et intentionnelle de la création de croquis et de l'exploration d'idées ; iii. présente les idées artistiques de façon claire et cohérente ; iv. démontre une capacité suffisante d'explorer et de présenter des idées de manière disciplinée.",
          "7-8": "L'élève : i. démontre une utilisation excellente, réfléchie et intentionnelle de compétences et techniques artistiques ; ii. démontre une utilisation excellente, réfléchie et intentionnelle de la création de croquis et de l'exploration d'idées ; iii. présente les idées artistiques de façon détaillée, logique et cohérente ; iv. démontre une capacité excellente d'explorer et de présenter des idées de manière disciplinée."
        }
      },
      C: {
        titre: "Création ou exécution",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. présente une intention artistique limitée ; ii. démontre une utilisation limitée de compétences et techniques artistiques ; iii. crée une œuvre artistique qui démontre des qualités limitées ; iv. démontre une capacité limitée d'explorer et de présenter des idées de manière disciplinée.",
          "3-4": "L'élève : i. présente une intention artistique claire ; ii. démontre une utilisation de compétences et techniques artistiques ; iii. crée une œuvre artistique qui démontre des qualités ; iv. démontre une capacité d'explorer et de présenter des idées de manière disciplinée.",
          "5-6": "L'élève : i. présente une intention artistique claire, détaillée et réalisable ; ii. démontre une utilisation suffisante et intentionnelle de compétences et techniques artistiques ; iii. crée une œuvre artistique qui démontre suffisamment de qualités ; iv. démontre une capacité suffisante d'explorer et de présenter des idées de manière disciplinée.",
          "7-8": "L'élève : i. présente une intention artistique claire, détaillée, réalisable et ambitieuse ; ii. démontre une utilisation excellente et intentionnelle de compétences et techniques artistiques ; iii. crée une œuvre artistique qui démontre des qualités excellentes ; iv. démontre une capacité excellente d'explorer et de présenter des idées de manière disciplinée."
        }
      },
      D: {
        titre: "Évaluation",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. énumère des réussites et des lacunes limitées de ses travaux artistiques ; ii. démontre une conscience limitée de son développement personnel en tant qu'artiste ; iii. interprète de façon limitée son intention en tant qu'artiste.",
          "3-4": "L'élève : i. décrit des réussites et des lacunes de ses travaux artistiques ; ii. démontre une conscience de son développement personnel en tant qu'artiste ; iii. interprète son intention en tant qu'artiste.",
          "5-6": "L'élève : i. décrit de façon critique avec suffisamment de détails des réussites et des lacunes de ses travaux artistiques ; ii. démontre une conscience suffisante de son développement personnel en tant qu'artiste ; iii. interprète avec suffisamment de détails son intention en tant qu'artiste.",
          "7-8": "L'élève : i. évalue de façon critique et approfondie des réussites et des lacunes de ses travaux artistiques ; ii. démontre une conscience approfondie de son développement personnel en tant qu'artiste ; iii. interprète de façon critique et avec perspicacité son intention en tant qu'artiste."
        }
      }
    }
  },

  // ============================================================================
  // ACQUISITION DE LANGUES - débutant, compétent, expérimenté
  // ============================================================================
  "acquisition de langues": {
    débutant: {
      A: {
        titre: "Compréhension orale",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie une information de base (phrases, mots ou idées) ; ii. avec de l'aide, identifie le message principal, le but et les détails importants du texte oral ; iii. avec de l'aide, identifie des conventions de base du texte oral.",
          "3-4": "L'élève : i. identifie une information variée (phrases, mots ou idées) dans le texte oral ; ii. identifie le message principal, le but et les détails importants du texte oral ; iii. identifie des conventions de base du texte oral.",
          "5-6": "L'élève : i. interprète une information variée (phrases, mots ou idées) dans le texte oral ; ii. interprète le message principal, le but et les détails importants du texte oral ; iii. identifie quelques aspects des conventions du format et du style du texte oral.",
          "7-8": "L'élève : i. interprète une information variée (phrases, mots ou idées) de manière détaillée dans le texte oral ; ii. interprète un message principal, un but et des détails importants implicites ou explicites dans le texte oral ; iii. identifie différents aspects des conventions du format et du style du texte oral."
        }
      },
      B: {
        titre: "Compréhension écrite",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie une information de base dans le texte écrit ; ii. avec de l'aide, identifie le message principal, le but et les détails importants du texte écrit ; iii. avec de l'aide, identifie des conventions de base du texte écrit.",
          "3-4": "L'élève : i. identifie une information variée dans le texte écrit ; ii. identifie le message principal, le but et les détails importants du texte écrit ; iii. identifie des conventions de base du texte écrit.",
          "5-6": "L'élève : i. interprète une information variée dans le texte écrit ; ii. interprète le message principal, le but et les détails importants du texte écrit ; iii. identifie quelques aspects des conventions du format et du style du texte écrit.",
          "7-8": "L'élève : i. interprète une information variée de manière détaillée dans le texte écrit ; ii. interprète un message principal, un but et des détails importants implicites ou explicites dans le texte écrit ; iii. identifie différents aspects des conventions du format et du style du texte écrit."
        }
      },
      C: {
        titre: "Expression orale",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes sur des sujets familiers ; ii. interagit dans des conversations simples et courtes ; iii. utilise des aspects de base d'expression orale, ainsi qu'un vocabulaire limité.",
          "3-4": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes sur des sujets familiers et variés ; ii. interagit dans des conversations simples et courtes ; iii. utilise des aspects de base d'expression orale, ainsi qu'un vocabulaire limité ; iv. communique avec un certain degré de fluidité et de spontanéité.",
          "5-6": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes sur une variété de sujets ; ii. interagit dans des conversations ; iii. utilise des aspects d'expression orale, ainsi qu'un vocabulaire approprié ; iv. communique avec un degré de fluidité et de spontanéité.",
          "7-8": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes et variées sur une variété de sujets ; ii. interagit dans des conversations avec quelques degrés de fluidité et de spontanéité ; iii. utilise des aspects d'expression orale, ainsi qu'un vocabulaire approprié et varié ; iv. communique avec un bon degré de fluidité et de spontanéité."
        }
      },
      D: {
        titre: "Expression écrite",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes sur des sujets familiers ; ii. organise l'information de façon minimale ; iii. utilise des aspects de base d'expression écrite, ainsi qu'un vocabulaire limité.",
          "3-4": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes sur des sujets familiers et variés ; ii. organise l'information et les idées ; iii. utilise des aspects de base d'expression écrite, ainsi qu'un vocabulaire limité ; iv. communique avec un certain degré de précision dans des situations familières.",
          "5-6": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes sur une variété de sujets ; ii. organise l'information et les idées ; iii. utilise des aspects d'expression écrite, ainsi qu'un vocabulaire approprié ; iv. communique avec un degré de précision dans des situations familières et certaines situations non familières.",
          "7-8": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes et variées sur une variété de sujets ; ii. organise l'information et les idées et crée un sentiment de cohésion ; iii. utilise des aspects d'expression écrite, ainsi qu'un vocabulaire approprié et varié ; iv. communique avec un bon degré de précision dans des situations familières et non familières."
        }
      }
    },
    compétent: {
      A: {
        titre: "Compréhension orale",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie une information de base (phrases, mots ou idées) ; ii. avec de l'aide, identifie le message principal, le but et les détails importants du texte oral ; iii. avec de l'aide, identifie des conventions de base du texte oral.",
          "3-4": "L'élève : i. interprète une information variée (phrases, mots ou idées) dans le texte oral ; ii. identifie le message principal, le but et les détails importants du texte oral ; iii. identifie des conventions de base du texte oral.",
          "5-6": "L'élève : i. interprète une information variée (phrases, mots ou idées) de manière détaillée dans le texte oral ; ii. interprète le message principal, le but et les détails importants du texte oral ; iii. identifie quelques aspects des conventions du format et du style du texte oral.",
          "7-8": "L'élève : i. interprète une information variée (phrases, mots ou idées) de manière détaillée dans le texte oral ; ii. interprète un message principal, un but et des détails importants implicites ou explicites dans le texte oral ; iii. analyse quelques aspects des conventions du format et du style du texte oral."
        }
      },
      B: {
        titre: "Compréhension écrite",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie une information de base dans le texte écrit ; ii. avec de l'aide, identifie le message principal, le but et les détails importants du texte écrit ; iii. avec de l'aide, identifie des conventions de base du texte écrit.",
          "3-4": "L'élève : i. interprète une information variée dans le texte écrit ; ii. identifie le message principal, le but et les détails importants du texte écrit ; iii. identifie des conventions de base du texte écrit.",
          "5-6": "L'élève : i. interprète une information variée de manière détaillée dans le texte écrit ; ii. interprète le message principal, le but et les détails importants du texte écrit ; iii. identifie quelques aspects des conventions du format et du style du texte écrit.",
          "7-8": "L'élève : i. interprète une information variée de manière détaillée dans le texte écrit ; ii. interprète un message principal, un but et des détails importants implicites ou explicites dans le texte écrit ; iii. analyse quelques aspects des conventions du format et du style du texte écrit."
        }
      },
      C: {
        titre: "Expression orale",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes sur des sujets familiers ; ii. interagit dans des conversations simples et courtes ; iii. utilise des aspects de base d'expression orale, ainsi qu'un vocabulaire limité.",
          "3-4": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes sur une variété de sujets ; ii. interagit dans des conversations ; iii. utilise des aspects d'expression orale, ainsi qu'un vocabulaire approprié ; iv. communique avec un degré de fluidité et de spontanéité.",
          "5-6": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes et variées sur une variété de sujets ; ii. interagit dans des conversations et discute quelques idées non familières ; iii. utilise des aspects d'expression orale, ainsi qu'un vocabulaire approprié et varié ; iv. communique avec un bon degré de fluidité et de spontanéité.",
          "7-8": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes, variées et développées sur une variété de sujets ; ii. interagit dans des conversations et discute des idées non familières ; iii. utilise des aspects d'expression orale, ainsi qu'un vocabulaire approprié, varié et efficace ; iv. communique avec un bon degré de fluidité, de spontanéité et de confiance."
        }
      },
      D: {
        titre: "Expression écrite",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes sur des sujets familiers ; ii. organise l'information de façon minimale ; iii. utilise des aspects de base d'expression écrite, ainsi qu'un vocabulaire limité.",
          "3-4": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes sur une variété de sujets ; ii. organise l'information et les idées ; iii. utilise des aspects d'expression écrite, ainsi qu'un vocabulaire approprié ; iv. communique avec un degré de précision dans des situations familières et certaines situations non familières.",
          "5-6": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes et variées sur une variété de sujets ; ii. organise l'information et les idées et crée un sentiment de cohésion ; iii. utilise des aspects d'expression écrite, ainsi qu'un vocabulaire approprié et varié ; iv. communique avec un bon degré de précision dans des situations familières et non familières.",
          "7-8": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes, variées et développées sur une variété de sujets ; ii. organise efficacement l'information et les idées et crée un sentiment de cohésion ; iii. utilise des aspects d'expression écrite, ainsi qu'un vocabulaire approprié, varié et efficace ; iv. communique avec un bon degré de précision dans des situations familières et non familières ; v. communique avec un style clair pouvant être personnel."
        }
      }
    },
    expérimenté: {
      A: {
        titre: "Compréhension orale",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie une information de base (phrases, mots ou idées) ; ii. avec de l'aide, identifie le message principal, le but et les détails importants du texte oral ; iii. avec de l'aide, identifie des conventions de base du texte oral.",
          "3-4": "L'élève : i. interprète une information variée (phrases, mots ou idées) de manière détaillée dans le texte oral ; ii. interprète le message principal, le but et les détails importants du texte oral ; iii. identifie quelques aspects des conventions du format et du style du texte oral.",
          "5-6": "L'élève : i. interprète une information variée (phrases, mots ou idées) de manière détaillée dans le texte oral ; ii. interprète un message principal, un but et des détails importants implicites ou explicites dans le texte oral ; iii. analyse quelques aspects des conventions du format et du style du texte oral.",
          "7-8": "L'élève : i. interprète une information variée (phrases, mots ou idées) de manière critique et détaillée dans le texte oral ; ii. interprète un message principal, un but et des détails importants implicites et explicites dans le texte oral ; iii. analyse les choix des créateurs dans le texte oral."
        }
      },
      B: {
        titre: "Compréhension écrite",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. identifie une information de base dans le texte écrit ; ii. avec de l'aide, identifie le message principal, le but et les détails importants du texte écrit ; iii. avec de l'aide, identifie des conventions de base du texte écrit.",
          "3-4": "L'élève : i. interprète une information variée de manière détaillée dans le texte écrit ; ii. interprète le message principal, le but et les détails importants du texte écrit ; iii. identifie quelques aspects des conventions du format et du style du texte écrit.",
          "5-6": "L'élève : i. interprète une information variée de manière détaillée dans le texte écrit ; ii. interprète un message principal, un but et des détails importants implicites ou explicites dans le texte écrit ; iii. analyse quelques aspects des conventions du format et du style du texte écrit.",
          "7-8": "L'élève : i. interprète une information variée de manière critique et détaillée dans le texte écrit ; ii. interprète un message principal, un but et des détails importants implicites et explicites dans le texte écrit ; iii. analyse les choix des créateurs dans le texte écrit."
        }
      },
      C: {
        titre: "Expression orale",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes sur des sujets familiers ; ii. interagit dans des conversations simples et courtes ; iii. utilise des aspects de base d'expression orale, ainsi qu'un vocabulaire limité.",
          "3-4": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes et variées sur une variété de sujets ; ii. interagit dans des conversations et discute quelques idées non familières ; iii. utilise des aspects d'expression orale, ainsi qu'un vocabulaire approprié et varié ; iv. communique avec un bon degré de fluidité et de spontanéité.",
          "5-6": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes, variées et développées sur une variété de sujets ; ii. interagit dans des conversations et discute des idées non familières ; iii. utilise des aspects d'expression orale, ainsi qu'un vocabulaire approprié, varié et efficace ; iv. communique avec un bon degré de fluidité, de spontanéité et de confiance.",
          "7-8": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes, variées, développées et convaincantes sur une variété de sujets ; ii. interagit dans des conversations et discute des idées non familières avec efficacité ; iii. utilise des aspects d'expression orale, ainsi qu'un vocabulaire approprié, varié et efficace ; iv. communique avec un haut degré de fluidité, de spontanéité et de confiance."
        }
      },
      D: {
        titre: "Expression écrite",
        niveaux: {
          "0": "L'élève n'atteint aucun des niveaux décrits ci-dessous.",
          "1-2": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes sur des sujets familiers ; ii. organise l'information de façon minimale ; iii. utilise des aspects de base d'expression écrite, ainsi qu'un vocabulaire limité.",
          "3-4": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes et variées sur une variété de sujets ; ii. organise l'information et les idées et crée un sentiment de cohésion ; iii. utilise des aspects d'expression écrite, ainsi qu'un vocabulaire approprié et varié ; iv. communique avec un bon degré de précision dans des situations familières et non familières.",
          "5-6": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes, variées et développées sur une variété de sujets ; ii. organise efficacement l'information et les idées et crée un sentiment de cohésion ; iii. utilise des aspects d'expression écrite, ainsi qu'un vocabulaire approprié, varié et efficace ; iv. communique avec un bon degré de précision dans des situations familières et non familières ; v. communique avec un style clair pouvant être personnel.",
          "7-8": "L'élève : i. communique des informations qui contiennent des idées et des opinions pertinentes, variées, développées et convaincantes sur une variété de sujets ; ii. organise efficacement l'information et les idées et crée un sentiment de cohésion et de persuasion ; iii. utilise des aspects d'expression écrite, ainsi qu'un vocabulaire approprié, varié, efficace et nuancé ; iv. communique avec un haut degré de précision dans des situations familières et non familières ; v. communique avec un style clair et personnel."
        }
      }
    }
  }
};

// Export default for convenience
export default DESCRIPTEURS_COMPLETS;
