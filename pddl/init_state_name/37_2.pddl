(define (problem scene1)
  (:domain manip)
  (:objects
    large red triangular prism - item
    small red triangular prism_1 - item
    small red triangular prism_2 - item
    large green triangular prism_1 - item
    large green triangular prism_2 - item
    small green triangular prism - item
    yellow basket - container
  )
  (:init
    (ontable large red triangular prism)
    (ontable small red triangular prism_2)
    (in small red triangular prism_1 yellow basket)
    (ontable large green triangular prism_2)
    (in large green triangular prism_1 yellow basket)
    (ontable small green triangular prism)
    (clear large red triangular prism)
    (clear small red triangular prism_2)
    (clear large green triangular prism_2)
    (clear small green triangular prism)
    (clear yellow basket)
    (handempty)
  )
  (:goal (and ))
)