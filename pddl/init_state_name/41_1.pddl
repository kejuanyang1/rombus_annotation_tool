(define (problem scene1)
  (:domain manip)
  (:objects
    small red cube - support
    small red triangular prism_1 small red triangular prism_2 - item
    flat yellow block_1 flat yellow block_2 - support
    small blue triangular prism_1 small blue triangular prism_2 - item
    long green block - support
    flat green block_1 flat green block_2 - support
    big green shopping basket yellow basket - container
  )
  (:init
    (ontable small red triangular prism_1)
    (ontable small red triangular prism_2)
    (ontable flat yellow block_1)
    (ontable flat yellow block_2)
    (ontable small blue triangular prism_1)
    (ontable small blue triangular prism_2)
    (ontable flat green block_2)
    (ontable small red cube)
    (in long green block big green shopping basket)
    (in flat green block_1 yellow basket)
    (handempty)
  )
  (:goal (and ))
)